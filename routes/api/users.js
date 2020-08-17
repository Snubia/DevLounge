const express = require('express');
//const gravatar = require('react-gravatar');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
// let multer = require('multer'),
//   mongoose = require('mongoose'),
//   uuidv4 = require('uuid/v4'),
//   router = express.Router();

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exists',
            },
          ],
        });
      }
      // introducing multer
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        {
          forceHttps: true,
        }
      );

      // const storage = multer.diskStorage({
      //   destination: (req, file, cb) => {
      //     cb(null, DIR);
      //   },
      //   filename: (req, file, cb) => {
      //     const fileName = file.originalname.toLowerCase().split(' ').join('-');
      //     cb(null, uuidv4() + '-' + fileName);
      //   },
      // }));

      // var upload = multer({
      //   storage: storage,
      //   fileFilter: (req, file, cb) => {
      //     if (
      //       file.mimetype == 'image/png' ||
      //       file.mimetype == 'image/jpg' ||
      //       file.mimetype == 'image/jpeg'
      //     ) {
      //       cb(null, true);
      //     } else {
      //       cb(null, false);
      //       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      //     }
      //   },
      // });

      // const DIR = './public/';
      // const storage = multer.diskStorage({
      //   destination: (req, file, cb) => {
      //     cb(null, DIR);
      //   },
      //   filename: (req, file, cb) => {
      //     const fileName = file.originalname.toLowerCase().split(' ').join('-');
      //     cb(null, uuidv4() + '-' + fileName)
      //   }
      // });
      // var upload = multer({
      //   storage: storage,
      //   fileFilter: (req, file, cb) => {
      //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      //       cb(null, true);
      //     } else {
      //       cb(null, false);
      //       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      //     }
      //   }
      // });
      // User model

      // router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
      //   const url = req.protocol + '://' + req.get('host')
      //   const user = new User({
      //     _id: new mongoose.Types.ObjectId(),
      //     name: req.body.name,
      //     profileImg: url + '/public/' + req.file.filename
      //   });
      //   user.save().then(result => {
      //     res.status(201).json({
      //       message: "User registered successfully!",
      //       userCreated: {
      //         _id: result._id,
      //         profileImg: result.profileImg
      //       }
      //     })
      //   }).catch(err => {
      //     console.log(err),
      //       res.status(500).json({
      //         error: err
      //       });
      //   })
      // })

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: '5 days',
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

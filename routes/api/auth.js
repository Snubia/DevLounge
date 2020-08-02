const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator'); //require('express-validator/check');

const User = require('../../models/User');

// route to get api/auth
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('-password');
    }
});

// route to Post api/auth
// to authenticate users and get token. has access to the public
router.post('/', [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            email,
            password
        } = req.body;

        try {
            // see if the user exists
            let user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credential'
                    }]
                });
            }

            // match the user and the password with bcrypt

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credential'
                    }]
                });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );

        } catch (err) {
            console.error(err.message);
            ReadableStream.status(500).send('Server error');
        }

    }
);

module.exports = router;
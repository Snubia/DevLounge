const express = require('express');
const router = express.Router();

// route to get api/users
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
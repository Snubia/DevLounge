const express = require('express');
const router = express.Router();

// route to get api/profile
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
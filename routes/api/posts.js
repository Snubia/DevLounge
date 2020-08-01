const express = require('express');
const router = express.Router();

// route to get api/post
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;
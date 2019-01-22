const express = require('express');
const router = express.Router();

router.get('/test', (request, response) => response.json({message: 'posts success'}));

module.exports = router;
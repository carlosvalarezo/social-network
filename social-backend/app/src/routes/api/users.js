const express = require('express');
const router = express.Router();

router.get('/test', (request, response) => response.json({message: 'users success'}));

module.exports = router;
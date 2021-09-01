const express = require('express')

// const dbConfig = require("../dbConfig");
const router = express.Router();
const {
    createManyMessages,
  } = require('../controllers/messages')


router.route('/').post(createManyMessages)

module.exports = router
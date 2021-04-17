var express = require('express');
var router = express.Router();
var jobController = require("../controllers/JobController.js");

// restrict index for logged in user only
router.get('/', jobController.jobs);
router.get('/:id', jobController.job);
router.post('/', jobController.newJob);

module.exports = router;
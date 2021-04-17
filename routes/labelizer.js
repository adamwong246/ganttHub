var express = require('express');
var router = express.Router();
var labelizer = require("../controllers/LabelizerController.js");

/* GET users listing. */
router.post('/', labelizer.labelize);

module.exports = router;

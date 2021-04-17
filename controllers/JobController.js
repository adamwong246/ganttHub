var Job = require("../models/Job");

var jobController = {};

jobController.jobs = function (req, res) {
  Job.find({}, function(err, jobs) {
    res.render('allJobs', {user : req.user, jobs});
  });
};

jobController.job = function (req, res) {
  Job.findById(req.params.id, function(err, job) {
    res.render('job', {user : req.user, job});
  });
};

jobController.newJob = function (req, res) {
  Job.create({
    status: 0, 
    timestamp: Date.now(),
    filepath: 'idk',
    iterations: req.body.iterations,
    label: req.body.label
  }, (j, d) => {
    res.redirect(`jobs/${d._id}`)
  })
};

module.exports = jobController;
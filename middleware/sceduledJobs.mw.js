const nodeCron = require("node-cron");
const { addVacationDays } = require("./../src/sceduledTasks");

exports.initScheduledJobs = (req, res) => {
  const scheduledJob = nodeCron.schedule("0 30 13 * * *", async (req, res) => {
    try {
      await addVacationDays(req, res);
    } catch (error) {
      res.status(404).json({ message: "unable to increment vacation days" });
    }
  });
  scheduledJob.start();
};

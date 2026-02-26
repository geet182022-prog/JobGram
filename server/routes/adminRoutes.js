const router = require("express").Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { verifyToken, verifyRole } = require("../middleware/auth");
const Application = require("../models/Application");

router.get("/stats",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {

    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();

    res.json({ users, jobs, applications });
});

// Get unapproved jobs
router.get("/pending-jobs",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const jobs = await Job.find({ approved: false });
    res.json(jobs);
});

// Approve job
router.put("/approve/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(job);
});

/* ===============================
   🔹 Reject Job
================================= */
router.delete("/reject/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: "Job rejected and deleted" });
});

router.put("/approve/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json(job);
});

router.delete("/user/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User Deleted" });
});

module.exports = router;
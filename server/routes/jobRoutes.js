const router = require("express").Router();
const Job = require("../models/Job");
const { verifyToken, verifyRole } = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require("../models/User");

// Post Job
// router.post("/", verifyToken, verifyRole("recruiter"), async (req, res) => {
//   const job = await Job.create({
//     ...req.body,
//     recruiter: req.user.id
//   });
//   res.json(job);
// });

// Post Job with logo
router.post(
  "/",
  verifyToken,
  verifyRole("recruiter"),
  upload.single("companyLogo"),
  async (req, res) => {
    const job = await Job.create({
      ...req.body,
      companyLogo: req.file?.filename,
      recruiter: req.user.id,
    });

    res.json(job);
  },
);

// Get Approved Jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find({ approved: true });
  res.json(jobs);
});

/* ===========================
   🔹 GET MY JOBS (Recruiter)
=========================== */
router.get(
  "/myjobs",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ recruiter: req.user.id });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ msg: "Error fetching recruiter jobs" });
    }
  },
);

// Edit Job
router.put("/:id", verifyToken, verifyRole("recruiter"), async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(job);
});

// Delete Job
router.delete(
  "/:id",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  },
);

// Save job
router.post(
  "/save/:id",
  verifyToken,
  verifyRole("candidate"),
  async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user.savedJobs.includes(req.params.id)) {
      user.savedJobs.push(req.params.id);
      await user.save();
    }

    res.json(user);
  },
);

router.get("/saved",
  verifyToken,
  verifyRole("candidate"),
  async (req, res) => {

    const user = await User.findById(req.user.id)
      .populate("savedJobs");

    res.json(user.savedJobs);
});

module.exports = router;

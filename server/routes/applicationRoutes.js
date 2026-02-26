const router = require("express").Router();
const Application = require("../models/Application");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Get applicants for recruiter
router.get(
  "/job/:jobId",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
    const apps = await Application.find({ job: req.params.jobId }).populate(
      "candidate",
      "name email resume",
    );

    res.json(apps);
  },
);

// 🔹 Get applicant count for a job
router.get(
  "/count/:jobId",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
    const count = await Application.countDocuments({
      job: req.params.jobId,
    });

    res.json({ count });
  },
);

// 🔹 Get applications for candidate
router.get(
  "/my-applications",
  verifyToken,
  verifyRole("candidate"),
  async (req, res) => {
    const apps = await Application.find({
      candidate: req.user.id,
    }).populate("job", "title company");

    res.json(apps);
  },
);

// Update application status
router.put(
  "/status/:id",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    res.json(app);
  },
);

// Withdraw
router.delete(
  "/:id",
  verifyToken,
  verifyRole("candidate"),
  async (req, res) => {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ msg: "Withdrawn" });
  },
);

// Apply
// router.post("/:jobId", verifyToken, verifyRole("candidate"), async (req, res) => {
//   const app = await Application.create({
//     job: req.params.jobId,
//     candidate: req.user.id
//   });
//   res.json(app);
// });
router.post(
  "/:jobId",
  verifyToken,
  verifyRole("candidate"),
  async (req, res) => {
    const existing = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ msg: "Already applied" });
    }

    // const app = await Application.create({
    //   job: req.params.jobId,
    //   candidate: req.user.id
    // });
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    if (!user.resume) {
      return res.status(400).json({
        msg: "Please upload resume before applying",
      });
    }
    const app = await Application.create({
      job: req.params.jobId,
      candidate: req.user.id,
    });

    res.json(app);
  },
);

module.exports = router;

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({ token, role: user.role });
});

router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json(user);
});

// Upload Resume
router.post(
  "/upload-resume",
  verifyToken,
  upload.single("resume"),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: req.file.filename },
      { new: true },
    );
    res.json(user);
  },
);

module.exports = router;

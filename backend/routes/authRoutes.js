const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "planify-secret-key";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to login. Please try again." });
  }
});

router.post("/register", async (req, res) => {
  console.log("POST /auth/register", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "A user with that email already exists." });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });
    await user.save();
    console.log("Registered user", user.email);

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated token for", user.email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const errorMessage = `Register error: ${error.stack || error}`;
    console.error(errorMessage);
    fs.appendFileSync(
      "./auth-register-error.log",
      `${new Date().toISOString()} ${errorMessage}\nRequest body: ${JSON.stringify(req.body)}\n\n`
    );
    res.status(500).json({
      message: "Unable to register. Please try again.",
      detail: error.message,
    });
  }
});

module.exports = router;

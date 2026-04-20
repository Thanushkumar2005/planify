const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/planify";
mongoose.connect(MONGO_URI)
.then(async () => {
  console.log("MongoDB Connected");
  const User = require("./models/User");
  const demoEmail = "demo@planify.app";
  const existingDemo = await User.findOne({ email: demoEmail });
  if (!existingDemo) {
    await User.create({
      email: demoEmail,
      password: "demo1234",
      name: "Demo User",
    });
    console.log("Created demo auth user:", demoEmail);
  }
})
.catch(err => console.log(err));

// Routes
const taskRoutes = require("./routes/taskRoutes");

const authRoutes = require("./routes/authRoutes");
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
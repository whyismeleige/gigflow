const express = require("express");
const cors = require("cors");
const connectDB = require("./database/mongoDB");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config(); 

const app = express();

const PORT = process.env.PORT || 8080;

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(
  cors({
    origin: [
      "https://taskmaster.piyushbuilds.me",
      "https://primetrade-internship.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/tasks", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Taskmaster API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    type: "error",
    data: null,
  });
});

app.use(errorHandler);

app.listen(PORT, () => console.log("Server running on PORT:", PORT));
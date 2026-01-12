require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { createServer } = require("node:http");

const intializeSocket = require("./sockets");
const connectDB = require("./database/mongoDB");
const errorHandler = require("./middleware/errorHandler");
 
const app = express();

const server = createServer(app);

const io = intializeSocket(server);

const PORT = process.env.PORT || 8080;

const authRoutes = require("./routes/auth.routes");
const gigsRoutes = require("./routes/gigs.routes");
const bidsRoutes = require("./routes/bids.routes");

app.set("io", io);

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigsRoutes);
app.use("/api/bids", bidsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GigFlow API is running",
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

server.listen(PORT, () => console.log("Server running on PORT:", PORT));
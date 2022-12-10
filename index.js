require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db.connection");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const vacationsRouter = require("./routes/vacation.routes");
const uiRoutes = require("./routes/ui.routes");
const cookieParser = require("cookie-parser");
const { initScheduledJobs } = require("./middleware/sceduledJobs.mw");
const { errorHandler } = require("./middleware/errorHandler.mw");
const { morgan } = require("./middleware/logger");
const fs = require("fs");
const logPath = path.join(__dirname, "access.log");

// Middlewares //
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

app.use(
  morgan(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);

initScheduledJobs();

// Routes //
app.use("/", express.static(path.join(__dirname, "/client/public")));
app.use("/", require("./routes/root"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/public", uiRoutes);
app.use("/api/vacation", vacationsRouter);

app.use(errorHandler);

// Connections //
connectDB();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

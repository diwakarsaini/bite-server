require("dotenv").config();
const express = require("express");
const restaurantRoute = require("./src/routes/restaurantRoutes.js");
const reviewRoutes = require("./src/routes/reviewRoutes");
const notificationsRoutes = require("./src/routes/notificationsRoutes");
const contactRoute = require("./src/routes/contactRoutesDB");
const eventRoute = require("./src/routes/eventRoutesDB");
const featurdEventRoute = require("./src/routes/featuredEventRoutesDB");
const userRoute = require("./src/routes/userRoutes.js");
const authRoute = require("./src/routes/authRoutes.js");
const jobRoute = require("./src/routes/jobRoutes");
const blogRoute = require("./src/routes/blogRoutesDB");
const applicationRoute = require("./src/routes/applicationRoutes");
const connectDB = require("./src/config/connectDB");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

app.use(cors());
app.use(fileUpload());

//connect to db
connectDB();

app.use(express.json());
app.use("/api/restaurants", restaurantRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/events", eventRoute);
app.use("/api/featuredEvents", featurdEventRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/application", applicationRoute);

//file upload
app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.myFile;

  const extension = path.extname(file.name);
  const allowedext = [".pdf", ".docx"];

  if (!allowedext.includes(extension)) {
    return res.status(400).send("Invalid file type.");
  }
  const path2 = "public/uploads/" + file.name;

  file.mv(path2, function (err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => {
  console.log("server started");
});

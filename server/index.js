const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const FolderRouter = require("./routes/Folder");
const ImageRouter = require("./routes/Image");


const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://root:tL3jziFqHVWu0RTA@cluster0.q7p62zc.mongodb.net/lexys?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/v1/folder", FolderRouter);
app.use("/api/v1/image", ImageRouter);

app.get("*", (req, res) => {
  res.status(404).send("404 API Endpoint Not Found!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

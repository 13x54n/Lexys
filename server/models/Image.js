const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imgSrc: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
  user: {
    type: String,
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;

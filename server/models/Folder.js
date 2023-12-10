const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
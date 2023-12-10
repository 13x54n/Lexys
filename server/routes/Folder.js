const Folder = require("../models/Folder");
const AsyncHandler = require("../utils/AsyncHandler");

const FolderRouter = require("express").Router();

FolderRouter.post(
  "/",
  AsyncHandler(async (req, res) => {
    const { folderName, user } = req.body;
    const folder = new Folder({ folderName, user });
    await folder.save();
    res.status(201).json(folder);
  })
);

FolderRouter.get(
  "/:uid",
  AsyncHandler(async (req, res) => {
    const folders = await Folder.find({ user: req.params.uid });
    res.status(200).json(folders);
  })
);

FolderRouter.patch(
  "/:id",
  AsyncHandler(async (req, res) => {
    const { folderName, user } = req.body;
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { folderName, user },
      { new: true }
    );
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json(folder);
  })
);

FolderRouter.delete(
  "/:id",
  AsyncHandler(async (req, res) => {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json({ message: "Folder deleted" });
  })
);

module.exports = FolderRouter;

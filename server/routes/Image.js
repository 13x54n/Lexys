const Image = require("../models/Image");
const AsyncHandler = require("../utils/AsyncHandler");
const { upload, imagekit } = require("../utils/ImageKit");
const fs = require("fs");

const ImageRouter = require("express").Router();

ImageRouter.post(
  "/",
  upload.array("lexysImage"),
  AsyncHandler(async (req, res) => {
    const { user, folderId } = req.body;

    req.files.map(async (file) => {
      const data = await new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const imagekitResponse = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: data,
            fileName: file.filename,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      await Image.create({
        imgSrc: imagekitResponse.url,
        user,
        folder: folderId,
      });
      fs.unlinkSync(file.path);
    });

    res.status(200).json({ msg: "Uploaded Images Successfully!" });
  })
);

ImageRouter.get(
  "/:uid",
  AsyncHandler(async (req, res) => {
    const images = await Image.find({ user: req.params.uid });
    res.status(200).json(images);
  })
);

ImageRouter.patch(
  "/delete/:id",
  AsyncHandler(async (req, res) => {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deleted_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedImage)
      return res.status(404).json({ error: "Folder not found" });

    res.status(200).json(updatedImage);
  })
);

ImageRouter.patch(
  "/:id",
  AsyncHandler(async (req, res) => {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      {
        folder: req.body.folderId,
      },
      { new: true }
    );

    if (!updatedImage)
      return res.status(404).json({ error: "Folder not found" });

    res.status(200).json(updatedImage);
  })
);

module.exports = ImageRouter;

import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { FileUploader } from "react-drag-drop-files";
import { auth } from "../../firebase";
import { UserContext } from "../contexts/User";
import { ImageContext } from "../contexts/Images";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const fileTypes = ["JPG", "PNG", "GIF", "WEBP"];

export default function Dashboard() {
  const user = auth.currentUser;

  const [showUploader, setShowUploader] = useState(false);

  const [file, setFile] = useState(null);
  const [folderSelection, setFolderSelection] = useState();

  const handleFileUploadChange = (file) => {
    setFile(file);
  };

  const uploadImages = () => {
    const formData = new FormData();
    formData.append("user", user.uid);
    for (let i = 0; i < file.length; i++) {
      formData.append("lexysImage", file[i]);
    }
    if (folderSelection) {
      formData.append("folderId", folderSelection);
    }
    fetch(`${import.meta.env.VITE_API_URI}/image`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        toast(data.msg);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const { userState, userDispatch } = useContext(UserContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/folder/${user.uid}`)
      .then((res) => res.json())
      .then((res) => userDispatch({ type: "SET_USER", payload: res }))
      .catch((err) => console.log(err));
  }, []);

  const { ImageState, ImageDispatch } = useContext(ImageContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/image/${user.uid}`)
      .then((res) => res.json())
      .then((res) => ImageDispatch({ type: "SET_IMAGE", payload: res }))
      .catch((err) => console.log(err));
  }, []);

  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
  const [imagePreviewIndex, setImagePreviewIndex] = useState(0);

  const handleImagePreviewModal = (index) => {
    setImagePreviewIndex(index);
    setIsImagePreviewModalOpen(true);
  };

  const deleteImage = (id) => {
    fetch(`${import.meta.env.VITE_API_URI}/image/delete/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const updatedImage = res;
        const updatedImages = [...ImageState.images];
        updatedImages[imagePreviewIndex] = updatedImage;
        setImagePreviewIndex((prev) => prev + 1);
        ImageDispatch({ type: "DELETE_IMAGE", payload: updatedImages });
        toast("Deleted Images will be on bin for 30 days!");
      });
  };

  return (
    <div className="relative min-h-[100vh]">
      <Helmet>
        <title>Lexys | Store Unlimited Photos</title>
      </Helmet>
      <Navbar setShowUploader={setShowUploader} />
      {showUploader && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-60 min-h-full min-w-full">
          <div className="relative min-h-full min-w-full">
            <div className="absolute bg-white p-4 top-[25vh] left-[50%] translate-x-[-50%] rounded">
              <div className="mb-4 flex flex-row justify-between items-center">
                <p className="text-sm font-medium">Upload Image</p>
                <button onClick={() => setShowUploader(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="red"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <FileUploader
                handleChange={handleFileUploadChange}
                name="file"
                types={fileTypes}
                multiple={true}
              />
              <p className="text-sm mt-2 font-medium">Add to Folder</p>

              <select
                value={folderSelection}
                onChange={(e) => {
                  setFolderSelection(e.target.value);
                }}
                className="w-full mt-2 p-1 px-3 rounded"
              >
                <option value="">All</option>
                {userState.folders.map((folder, index) => (
                  <option value={folder._id} key={index}>
                    {folder.folderName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => uploadImages()}
                className="mt-3 w-full py-2 rounded text-sm bg-indigo-900 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-[3vw] py-5 flex flex-wrap gap-4">
        {!isImagePreviewModalOpen &&
          ImageState.images.reverse().map((image, index) => {
            if (!image.deleted)
              return (
                <img
                  onClick={() => handleImagePreviewModal(index)}
                  key={index}
                  className="h-40 object-contain rounded"
                  src={image.imgSrc}
                  alt={image.imgSrc}
                />
              );
          })}

        {isImagePreviewModalOpen && (
          <div className="w-full">
            <div className="flex flex-row justify-between items-center">
              <button
                className="flex flex-row items-center gap-1 text-red-500 text-sm font-medium"
                onClick={() => setIsImagePreviewModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
              <div className="flex flex-row items-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      ImageState.images[imagePreviewIndex].imgSrc
                    );
                    toast("Link copied to clipboard!");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    saveAs(ImageState.images[imagePreviewIndex].imgSrc);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
                <button
                  className="flex flex-row items-center gap-1 text-red-500 text-sm font-medium"
                  onClick={() =>
                    deleteImage(ImageState.images[imagePreviewIndex]._id)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-row items-center mt-4 h-[75vh]">
              <button
                className="h-full hover:bg-gray-100 px-3"
                disabled={imagePreviewIndex > 0 ? false : true}
                onClick={() => setImagePreviewIndex(imagePreviewIndex - 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <img
                className="flex-1 h-full object-contain"
                src={ImageState.images[imagePreviewIndex].imgSrc}
                alt=""
              />
              <button
                className="h-full hover:bg-gray-100 px-3"
                disabled={
                  imagePreviewIndex < ImageState.images.length - 1
                    ? false
                    : true
                }
                onClick={() => setImagePreviewIndex(imagePreviewIndex + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

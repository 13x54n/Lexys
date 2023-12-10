import React, { useState } from "react";
import Navbar from "../contexts/Navbar";
import { Helmet } from "react-helmet";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF", "WEBP"];

export default function Dashboard() {
  const [showUploader, setShowUploader] = useState(false);

  const [file, setFile] = useState(null);

  const handleFileUploadChange = (file) => {
    setFile(file);
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
                <p className="text-sm">Upload Image</p>
                <button onClick={() => setShowUploader(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
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
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-[3vw] py-5 flex flex-wrap gap-4">
        <img
          className="h-40 object-contain rounded"
          src="https://images.unsplash.com/photo-1702094079674-1bf0725624dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { FileUploader } from "react-drag-drop-files";
import { auth } from "../../firebase";
import { UserContext } from "../contexts/User";

const fileTypes = ["JPG", "PNG", "GIF", "WEBP"];

export default function Dashboard() {
  const [showUploader, setShowUploader] = useState(false);

  const [file, setFile] = useState(null);

  const handleFileUploadChange = (file) => {
    setFile(file);
  };

  const user = auth.currentUser;
  const { userState, userDispatch } = useContext(UserContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/folder/${user.uid}`)
      .then((res) => res.json())
      .then((res) => userDispatch({ type: "SET_USER", payload: res }))
      .catch((err) => console.log(err));
  }, []);

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
              />
              <p className="text-sm mt-2 font-medium">Add to Folder</p>

              <select className="w-full mt-2 p-1 px-3 rounded">
                <option value="all">All</option>
                {userState.folders.map((folder, index) => (
                  <option value={folder._id} key={index}>{folder.folderName}</option>
                ))}
              </select>
              <button className="mt-3 w-full py-2 rounded text-sm bg-indigo-900 text-white">Submit</button>
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

import { useState } from "react";
import { auth } from "../../firebase";
import ProfileSidebar from "../components/ProfileSidebar";

export default function Navbar({setShowUploader}) {
  const user = auth.currentUser;
  const [openProfileSidebar, setOpenProfileSidebar] = useState(false)

  const handleOpenSidebar = () => {
    setOpenProfileSidebar(prev => !prev)
  }

  const handleOpenUploader = () => {
    setShowUploader(true)
  }

  return (
    <nav className="border flex flex-row align-middle justify-between p-3 px-[3vw]">
      <div className="flex flex-row gap-2 align-middle items-center">
      <img
        src="https://ik.imagekit.io/13x54r/_0bd933b9-e3f4-41f5-9306-7e85a54640b7.jpg?updatedAt=1702170800035"
        alt="Lexys Logo"
        className="h-10"
      />
      <p className="text-sm font-medium">Lexys</p>
      </div>

      <div className="flex flex-row gap-5 align-middle items-center">
        <button onClick={() => handleOpenUploader()} className="flex flex-row gap-1 align-middle items-center text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </button>

        <button onClick={() => handleOpenSidebar()}>
          <img className="h-10 rounded-full" src={user.photoURL} alt={user.email} />
        </button>

        <ProfileSidebar openProfileSidebar={openProfileSidebar} handleOpenSidebar={handleOpenSidebar}/>
      </div>
    </nav>
  );
}

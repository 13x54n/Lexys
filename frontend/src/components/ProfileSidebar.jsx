import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { auth } from "../../firebase";
import { UserContext } from "../contexts/User";
import { signOut } from "firebase/auth";
import FolderActionButton from "./FolderActionButton";

export default function ProfileSidebar({
  openProfileSidebar,
  handleOpenSidebar,
}) {
  const user = auth.currentUser;
  const { userState, userDispatch } = useContext(UserContext);

  const handleUserSignOut = () => {
    signOut(auth);
  };

  const [folderActionState, setFolderActionState] = useState("Create");
  const [openNewFolderForm, setOpenNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleNewFolder = () => {
    fetch(`${import.meta.env.VITE_API_URI}/folder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folderName: newFolderName,
        user: user.uid,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        setNewFolderName("");
        setOpenNewFolderForm(false);
        userDispatch({ type: "ADD_FOLDER", payload: res });
      })
      .catch((err) => console.log(err));
  };

  const handleEditFolderSubmit = () => {
    fetch(
      `${import.meta.env.VITE_API_URI}/folder/${
        userState.folders[localStorage.getItem("lexys_updateitem_index")]._id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderName: newFolderName,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setNewFolderName("");
        setOpenNewFolderForm(false);
        const updatedItem = res;
        const updatedFolders = [...userState.folders];
        updatedFolders[localStorage.getItem("lexys_updateitem_index")] =
          updatedItem;
        userDispatch({ type: "UPDATE_FOLDER", payload: updatedFolders });
        localStorage.removeItem("lexys_updateitem_index");
      });
  };

  return (
    <Transition.Root show={openProfileSidebar} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => handleOpenSidebar()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => handleOpenSidebar()}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                        Profile
                      </Dialog.Title>
                    </div>
                    {/* edit here */}
                    <div className="relative mt-3 flex-1 px-4 sm:px-6">
                      <div className="flex flex-row items-center gap-2 border-b-2 pb-4">
                        <img
                          src={user.photoURL}
                          alt={user.email}
                          className="w-10 object-contain rounder-full"
                        />
                        <div className="text-sm">
                          <p>{user.email}</p>
                          <button
                            onClick={() => handleUserSignOut()}
                            className="font-medium"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between">
                        <p className="text-md mt-2 font-medium">Albums</p>
                        <button onClick={() => setOpenNewFolderForm(true)}>
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
                              d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                            />
                          </svg>
                        </button>
                      </div>

                      {openNewFolderForm && (
                        <div className="flex flex-row gap-2 items-center mt-2">
                          <input
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            type="text"
                            placeholder="Folder Name..."
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <button
                            onClick={() =>
                              folderActionState === "Create"
                                ? handleNewFolder()
                                : handleEditFolderSubmit()
                            }
                            className="bg-black text-white p-2 px-3 rounded text-sm"
                          >
                            {folderActionState}
                          </button>
                        </div>
                      )}

                      {userState.folders.map((folder, index) => {
                        return (
                          <div
                            key={index}
                            className="w-full hover:bg-gray-100 cursor-pointer p-3 border-b-2 flex flex-row justify-between items-center"
                          >
                            <p className="flex flex-row gap-2 items-center text-sm">
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
                                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                                />
                              </svg>
                              {folder.folderName}
                            </p>
                            {folder.folderName !== "All" && (
                              <FolderActionButton
                                setFolderActionState={setFolderActionState}
                                setNewFolderName={setNewFolderName}
                                folder={folder}
                                setOpenNewFolderForm={setOpenNewFolderForm}
                                index={index}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

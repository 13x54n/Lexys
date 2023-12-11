import React, { createContext, useReducer } from "react";

const initialUserState = {
  folders: [{ folderName: "All" }],
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, folders: [...state.folders, ...action.payload] };
    case "ADD_FOLDER":
      return { ...state, folders: [...state.folders, action.payload] };
    case "UPDATE_FOLDER":
      return { ...state, folders: action.payload };
    case "DELETE_FOLDER":
      return { ...state, folders: action.payload };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserContext.Provider
      value={{
        userState,
        userDispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

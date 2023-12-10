import React, { createContext, useReducer } from "react";

const initialUserState = {
  folders: [],
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
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

import React, { createContext, useReducer } from "react";

const initialImageState = {
  images: [],
};

const ImageReducer = (state, action) => {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, images: action.payload };
    case "DELETE_IMAGE":
      return { ...state, images: action.payload };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export const ImageContext = createContext();

export const ImageContextProvider = ({ children }) => {
  const [ImageState, ImageDispatch] = useReducer(
    ImageReducer,
    initialImageState
  );

  return (
    <ImageContext.Provider
      value={{
        ImageState,
        ImageDispatch,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

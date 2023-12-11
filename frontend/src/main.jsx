import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "./utils/Router.jsx";
import { UserContextProvider } from "./contexts/User.jsx";
import { ImageContextProvider } from "./contexts/Images.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <UserContextProvider>
      <ImageContextProvider>
        <Router />
      </ImageContextProvider>
    </UserContextProvider>
    <ToastContainer/>
  </>
);

import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./utils/Router.jsx";
import { UserContextProvider } from "./contexts/User.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  </>
);

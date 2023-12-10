import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Authentication from "../pages/Authentication";
import { auth } from "../../firebase";
import Dashboard from "../pages/Dashboard";

export default function Router() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Navigate to="/app" /> : <Authentication />,
    },
    {
      path: "/app",
      element: user ? <Dashboard /> : <Navigate to="/" />,
    },
    {
      path: "*",
      element: <>404 Not Found</>,
    },
  ]);

  return <RouterProvider router={router} />;
}

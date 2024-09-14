import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
//import { fetchEmptyJSON } from "../pages/HomePage/HomePage";
import React from "react";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import ProtectedRoute from "../components/ProtectiveRoutes/ProtectedRoute";


const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute/>,//Replace with protectedRoute once backend updates
      //insert loaders here
      children: [
        {
          path:"",
          element: <HomePage />,//Add homepage here
        },
      ],
    },
    {
      path:"/login",
      element:<Login />,
    },
    {
      path:"/register",
      element:<Register />
    }
]);

export default router;
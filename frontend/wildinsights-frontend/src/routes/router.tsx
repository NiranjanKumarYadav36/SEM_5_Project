import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/Home";
import React from "react";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import ProtectedRoute from "../components/ProtectiveRoutes/ProtectedRoute";
import Explore from "../pages/ExplorePage/Explore";


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
    },
    {
      path:"/explore",
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"",
          element: <Explore />
        },
      ]
    }
]);

export default router;
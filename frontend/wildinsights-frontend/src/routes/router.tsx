import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/Home";
import React from "react";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import ProtectedRoute from "../components/ProtectiveRoutes/ProtectedRoute";
import Explore from "../pages/ExplorePage/Explore";
import PageNotFound from "../pages/PageNotFound/Pagenotfound";


const router = createBrowserRouter([
    {
      path: "/",//Homepage
      element: <ProtectedRoute/>,
      //insert loaders here
      children: [
        {
          path:"",
          element: <HomePage />,
        },
      ],
    },
    {
      path:"/explore",//Explore
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"",
          element: <Explore />
        },
      ]
    },
    {
      path: "/community",
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"/community/people",
          element: <div />
        },
        {
          path:"/community/projects",
          element: <div />
        },
        {
          path:"/community/forum",
          element: <div />
        },
      ]
    },
    {
      path:"/user",
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"/user/dashboard",
          element: <div />
        },
        {
          path:"/user/profile",
          element: <div />
        },
      ]
    },
    {
      path:"/login",//Login
      element:<Login />,
    },
    {
      path:"/register",//Register
      element:<Register />
    },
    {
      path:"*",//Any urls that dont exist
      element:<PageNotFound/>
    }
]);

export default router;
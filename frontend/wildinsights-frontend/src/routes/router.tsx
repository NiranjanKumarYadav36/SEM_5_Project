import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/Home";
import React, { lazy, Suspense } from "react";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import ProtectedRoute from "../components/ProtectiveRoutes/ProtectedRoute";
import PageNotFound from "../pages/PageNotFound/Pagenotfound";
import Identifiers from "../pages/Explore/Identifiers/identifiers";
import Observers from "../pages/Explore/Observers/observers";
import Species from "../pages/Explore/Species/species";
import LoadingScreen from "../components/LoadingScreen/Loading";

const Explore = lazy(() => import("../pages/Explore/Explore/Explore"));

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
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <Explore />
            </Suspense>
          ),
        },
        {
          path:"/explore/species",
          element: <Species />,
        },
        {
          path:"/explore/identifiers",
          element: <Identifiers />,
        },
        {
          path:"/explore/observers",
          element: <Observers />,
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
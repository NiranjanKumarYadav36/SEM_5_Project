import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/Home";
import React, { Suspense } from "react";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import ProtectedRoute from "../components/ProtectiveRoutes/ProtectedRoute";
import PageNotFound from "../pages/PageNotFound/Pagenotfound";
import Identifiers from "../pages/Explore/Identifiers/identifiers";
import Observers from "../pages/Explore/Observers/observers";
import Species from "../pages/Explore/Species/species";
import LoadingScreen from "../components/LoadingScreen/Loading";
import UserProfile  from "../pages/User/Profile/profile";
import UserDashboard from "../pages/User/Dashboard/dashboard";
import Explore from "../pages/Explore/Explore/Explore";
import { People } from "../pages/Community/People/people";
import { Identify } from "../pages/Identify/identify";
import MyObservation from "../pages/Explore/YourObservation/your_observation";
import { ObservationView } from "../pages/ObservationsView/observationview";


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
        {
          path:"/explore/your_observations",
          element: <MyObservation />,
        }
      ]
    },
    {
      path: "/community",
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"/community/people",
          element: <People />
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
      path: "/identify",
      element:<ProtectedRoute />,
      children:[
        {
          path: "",
          element:<Identify />,
        }
      ]
    },
    {
      path: "/observations",
      element:<ProtectedRoute />,
      children:[
        {
          path: "/observations/:id",
          element: <ObservationView />,
        }
      ]
    },
    {
      path:"/user",
      element:<ProtectedRoute />,
      //insert loaders here
      children: [
        {
          path:"/user/dashboard",
          element: <UserDashboard />
        },
        {
          path:"/user/profile",
          element: <UserProfile />
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
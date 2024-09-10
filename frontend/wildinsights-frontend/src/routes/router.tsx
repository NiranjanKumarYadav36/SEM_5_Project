import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import { fetchEmptyJSON } from "../pages/HomePage/HomePage";
import ItemList from "../components/ItemList";
import React from "react";

const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      loader: fetchEmptyJSON ,
      children: [
        {
          path: "",
          element: <div />,
        },
      ],
    },
]);

export default router;
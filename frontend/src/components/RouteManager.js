

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


// react components
// import PathwayPage from "./PathwayPage";
import SplashPage from "./SplashPage";
import ErrorPage from "./ErrorPage";
import RootLayout from "./RootLayout";

/**
 * A declaritive definition of the routes within the website
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <SplashPage />
      },
    ]
  }
])

/**
 * This Route manager is based off the react router dom's create browser router
 * Here is an excellent tutorial to learn this 
 * https://reactrouter.com/en/main/start/tutorial 
 * @param {*} props 
 * @returns React Router Dom RouterProvider
 */
const RouteManager = (props) => {
  return <RouterProvider router={router} />
}


export default RouteManager;


import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


// react components
// import PathwayPage from "./PathwayPage";
import SplashPage from "./pages/SplashPage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./RootLayout";
import PathwayView from "./PathwayView";
import PathwayEditorPage from "./pages/PathwayEditorPage";

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
      {
        path: "/explore",

      },
      {
        path: "pathway",
        element: <PathwayEditorPage />,
        children: [
          {
            path: "/:pathwayId",
            element: <PathwayView />
          }
        ]
      }
    ]
  }
])

/**
 * This Route manager is based off the react router dom's create browser router
 * Here is an excellent tutorial to learn this 
 * https://reactrouter.com/en/main/start/tutorial 
 * @returns React Router Dom RouterProvider
 */
const RouteManager = () => {
  return <RouterProvider router={router} />
}


export default RouteManager;
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


// react components
// import PathwayPage from "./PathwayPage";
import SplashPage from "./pages/SplashPage";
import ExplorePage from "./pages/ExplorePage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./RootLayout";
import PathwayView from "./PathwayView";

// Loaders 
import { splashPageLoader } from "../requestLib/loaders/splashPageLoader";
import { pathwayViewLoader } from "../requestLib/loaders/pathwayViewLoader";

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
        loader: splashPageLoader,
        element: <SplashPage />
      },
      {
        path: "explore",
        element: <ExplorePage />
      },
      {
        path: "pathway/:pathwayId",
        element: <PathwayView />,
        loader: pathwayViewLoader
      }, 
      {
        path: "pathway/:pathwayId/edit",
        element: <PathwayView />,
        loader: pathwayViewLoader
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
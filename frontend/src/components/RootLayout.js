import { Outlet } from "react-router-dom";

import Navbar from "./NavBar";


/**
 * This is the root of the project (different from the provided root)
 * This component is essentially a page organizer for the larger components
 * @returns Layout component
 */
const RootLayout = () => {
  return (
    <div id="RootLayout">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default RootLayout;
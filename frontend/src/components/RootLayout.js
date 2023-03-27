import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import UserContext from "../UserContext";

import Navbar from "./NavBar";


/**
 * This is the root of the project (different from the provided root)
 * This component is essentially a page organizer for the larger components
 * @returns Layout component
 */
const RootLayout = () => {

  const [user, setUser] = useState(null)
  const userProvider= useMemo(() => ({ user, setUser }), [user, setUser])
  //console.log(userProvider);
  return (
    <div className="d-flex w-100 flex-column">
      {/* This provider gives context access to the user context to all 
          components wrapped within it (which will be everything) */}
      <UserContext.Provider value={ userProvider }>
        <Navbar />
        <Outlet />
      </UserContext.Provider>
    </div>
  );
}

export default RootLayout;
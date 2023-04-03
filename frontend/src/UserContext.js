import { createContext } from "react";

/**
 * This context is used for storing a sign in status across the react app
 */
console.log("Creating null UserContext");
const UserContext = createContext(null);

export default UserContext;
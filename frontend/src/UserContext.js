import { createContext } from 'react';
import { getUser } from './localStoreAccess/userAccess';

/**
 * This context is used for storing a sign in status across the react app
 */
let user = getUser();
let UserContext = null;
if (user) {
    UserContext = createContext({ username: user.username });
} else {
    UserContext = createContext(null);
}

export default UserContext;

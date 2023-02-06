import React, {useContext, useState} from "react";

import UserContext from "../../UserContext";
import login from "../../requestLib/login.js"

/**
 * 
 * @param {*} props 
 * @returns 
 */
const SignInModal = (props) => {

  const { user, setUser } = useContext(UserContext);

  // remains null until sign in attempt is made 
  // once attempt is made, true/false is set which influences modal rendering
  const [isUserValid, setIsUserValid] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleSignInClick = async () => {
    const userObj = await login(username, password);
    
    // check if a valid userObj was returned
    setUser(userObj)
  }

  return (
    <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="signInModalLabel">Sign In</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body ">
            <form>
              <div className="mb-3">
                <input 
                  className="form-control" 
                  type="text" 
                  placeholder="Username" 
                  aria-label="username textbox"
                  onChange={e => setUsername(e.target.value)}/>
              </div>  
              <div className="mb-3">
                <input 
                  className="form-control" 
                  type="text" 
                  placeholder="Password" 
                  aria-label="password textbox"
                  onChange={e => setPassword(e.target.value)}/>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSignInClick} >Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
import React, {useContext, useState} from "react";

import UserContext from "../../UserContext";
import { login, register } from "../../requestLib/loginRequests";

/**
 * 
 * @param {*} props 
 * @returns 
 */
const SignInModal = (props) => {

  const { user, setUser } = useContext(UserContext);

  // remains null until sign in attempt is made 
  // once attempt is made, true/false is set which influences modal rendering
  const [isUserValid, setIsUserValid] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [signInMode, setSignInMode] = useState("signIn") 


  /**
   * handler which contains logic for switching form from sign in to sign up
   * and vice versa
   */
  const handleSignInModeSwitch = () => {
    if (signInMode === "signIn") {
      setSignInMode("signUp");
    }
    else {
      setSignInMode("signIn");
    }
  }

  /**
   * Handler for taking entered username and password which should be either 
   * used for sign in or sign up based on mode selection
   */
  const handleSignInClick = async () => {

    if (signInMode === "signUp") {
      const res = await register(username, password)

      if (!res.ok) {
        setIsUserValid(false);
      }
    }
    
    
    if (isUserValid) {
      const res = await login(username, password)
    }
  }

  return (
    <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="signInModalLabel">
              { signInMode === "signIn" 
                ? <>Sign In</>
                : <>Sign Up</>
              }
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body list-group list-group-flush">
            <div className="list-group-item container">
              <span className="col-md-8">
                { signInMode === "signIn" 
                  ? <>Don't have an account?</>
                  : <>Already have an account?</>
                }
              </span>
              <button id="signInFormSwapButton" type="button" className="btn btn-primary btn-sm col" onClick={handleSignInModeSwitch}>
                { signInMode !== "signIn" 
                  ? <>Sign In</>
                  : <>Sign Up</>
                }
              </button>
            </div>
            <form className="form list-group-item">
              <div className="form-group mb-3">
                <label className="control-label text-left" htmlFor="usernameTextBox">Username</label>
                <input 
                  id="usernameTextBox"
                  className="form-control" 
                  type="text" 
                  aria-label="username textbox"
                  onChange={e => setUsername(e.target.value)}/>
              </div>  
              <div className="form-group mb-3">
                <label className="control-label" htmlFor="passwordTextBox">Password</label>
                <input 
                  id="passwordTextBox"
                  className="form-control" 
                  type="password" 
                  aria-label="password textbox"
                  onChange={e => setPassword(e.target.value)}/>
              </div>
              { !isUserValid &&
                <small className="text-danger">The username or password you entered are invalid, try again.</small>
              }
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSignInClick} >
             { signInMode === "signIn" 
                ? <>Sign In</>
                : <>Sign Up</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
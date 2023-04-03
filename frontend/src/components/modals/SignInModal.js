import React, {useContext, useState} from "react";

import UserContext from "../../UserContext";
import { login, register } from "../../requestLib/loginRequests";
import { saveTokens } from "../../localStoreAccess/jwtAccess";
import { saveUser } from "../../localStoreAccess/userAccess";

/**
 * 
 * @param {*} props 
 * @returns 
 */
const SignInModal = (props) => {
  const { user, setUser } = useContext(UserContext);

  // remains null until sign in attempt is made 
  // once attempt is made, true/false is set which influences modal rendering
  const [isUserValid, setIsUserValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null)

  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  // state for determining what type of form to display
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
      const res = await register(usernameText, passwordText)

      if (!res.ok) {
        setIsUserValid(false);
        return
      }
    }
    
    const resData = await login(usernameText, passwordText);

    if (resData) {
      setIsUserValid(true)
      saveTokens(resData.access, resData.refresh);

      // set user information and route back to home page 
      const signedInUser = {
        username: usernameText
      }
      saveUser(signedInUser)
      setUser(signedInUser)
    }
    else {
      setErrorMsg("Invalid Login")
    }
  }

  return (
    <div className="modal fade align-items-start" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
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
                <form className="form list-group-item">
                <div className="form-group mb-3">
                    <label className="control-label text-left" htmlFor="usernameTextBox">Username</label>
                    <input 
                    id="usernameTextBox"
                    className="form-control" 
                    type="text" 
                    aria-label="username textbox"
                    onChange={e => setUsernameText(e.target.value)}/>
                </div>  
                <div className="form-group mb-3">
                    <label className="control-label" htmlFor="passwordTextBox">Password</label>
                    <input 
                    id="passwordTextBox"
                    className="form-control" 
                    type="password" 
                    aria-label="password textbox"
                    onChange={e => setPasswordText(e.target.value)}/>
                </div>
                { errorMsg &&
                    <small className="text-danger">{errorMsg}</small>
                }
                </form>
                <button type="button" className="btn btn-secondary mb-3" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSignInClick} >
                { signInMode === "signIn" 
                    ? <>Sign In</>
                    : <>Sign Up</>
                }
                </button>
            </div>
            <div className="modal-footer">
                <div className="list-group-item container">
                    <span className="col-md-8">
                        { signInMode === "signIn" 
                            ? <>Don't have an account?</>
                            : <>Already have an account?</>
                        }
                    </span>
                    <button id="signInFormSwapButton" type="button" className="btn btn-primary btn-sm col ms-3" onClick={handleSignInModeSwitch}>
                        { signInMode !== "signIn" 
                            ? <>Sign In</>
                            : <>Sign Up</>
                        }
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
}

export default SignInModal;
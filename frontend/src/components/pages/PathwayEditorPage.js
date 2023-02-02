import { Outlet } from "react-router-dom";


/**
 * A Page which will contain everything related to the pathway editor. 
 * There will be different ways which could affect how a pathway is opened which could include 
 * 1) is user signed in 
 * 2) does user have write access to this pathway
 * 3) does the user own this pathway
 * 4) is a pathway open right now 
 * etc.
 * @param {*} props 
 * @returns 
 */
const PathwayEditorPage = (props) => { 

  return (
    <div id="PathwayEditorPage">
      <Outlet/>
    </div> 
  );
}

export default PathwayEditorPage;
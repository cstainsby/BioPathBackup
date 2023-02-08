

/**
 * A component which allows the user to edit the pathway
 * NOTE: This tool should only be visible if the current user has write access to the pathway being viewed 
 * 
 * this build tool should have 
 * 1) a pause/play button
 * 2) 
 * @param {*} props 
 * @returns 
 */
const UserBuildTool = (props) => {
  return (
    <div id="UserBuildTool" className="card container">
      <div className="row row-cols-auto">
        <div className="col-sm-1">
        Build Tool
        </div>
      </div>
    </div>
  );
}

export default UserBuildTool;
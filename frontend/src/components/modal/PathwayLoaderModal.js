
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getPathways } from "../../requestLib/requests";


// ----------------------------------------------------------------------
// PathwayLoaderModal
// ----------------------------------------------------------------------
const PathwayLoaderModal = (props) => {

  const [pathways, setPathways] = useState(null);

  useEffect(() => {
    // get JSON data for pathways
    // including function here will force the modal to re-render
    setPathways(pathways => getPathways()
      .then(data => {
        // read list of pathways into a list for state
        let pathwayList = []
        for(let i = 0; i < data.length; ++i) {
          pathwayList.push(data[i]);
        }

        setPathways(pathways => pathwayList);
      })
      .catch(error => {
        console.error("Error in getPathways loadModal", error);
      }));
  }, []);

  const buildPathwayCardsList = () => {
    // helper function which dynamically builds cards list containing each pathway for the user to choose from
    // NOTE the json Data should be in a list
    // onClick={ (e) => this.onPathwaySelected(pathway.id, e)}
    let pathwayListHtml = pathways.map((pathway) => {
      return (
        <li id='loadPathwayListItem' className='growCard' key={pathway.id}>
          <div className="card">
            <button id="loadPathwaySelect" >
              <Link to={ "/pathway/" + pathway.id }>
                <div className="card-body" data-bs-dismiss="modal">
                  <div className="container text-center">
                    <h3 className='loadPathwayListTitle'>{ pathway.name }</h3>
                    <p className='loadPathwayListAuthor'>Created By { pathway.author } </p>
                  </div>
                </div>
              </Link>
            </button>
          </div>
        </li>);
    });
    let finalCardListHtml = <ul id="loadPathwayList">{ pathwayListHtml }</ul>;
    
    return finalCardListHtml;
  }

  return (
    <div className="modal fade" id="PathwayLoaderModal" tabIndex="-1" aria-labelledby="PathwayLoaderModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="PathwayLoaderModalLabel">Open</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            { ( pathways !== null)
              ? (( pathways.length > 0 )                           // if there are pathways to display
                ? buildPathwayCardsList(pathways)                  // display them
                : <h4>Looks like there aren't any pathways</h4>)   // otherwise send message to user
              : <h4>Error</h4> 
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PathwayLoaderModal;
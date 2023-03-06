import React, {useContext, useEffect, useState} from "react"
import { Link, useLoaderData } from "react-router-dom";

import UserContext from "../../UserContext";

/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
const SplashPage = () => {
  const splashPageLoaderData = useLoaderData() // get data loaded from react router

  const { user, setUser } = useContext(UserContext);

  // for the displays initially set them to empty until we recieve data from the backend
  const [recentWork, setRecentWork] = useState([]);
  const [feed, setFeed] = useState([]);


  useEffect(() => {
    if(splashPageLoaderData.recentWork) setRecentWork(splashPageLoaderData.recentWork);
    
    if(splashPageLoaderData.feed) setFeed(splashPageLoaderData.feed);
  }, [splashPageLoaderData])
  
  return (
    <div id="SplashPage" className="container">
      <h1>Biopath</h1>
      <p>A Biochemistry Interactive Learning Tool</p>


      {/* Pick up where you left off section
        Note: this should only display if the user is signed in */}
      { user && 
        <div id="LeftOffArea" className="row container informationalSection">
          <div className="row informationalHeaderSection">
            <h4 className="col pushDown">Jump Back In</h4>
            <Link className="col offset-8 btn" to={"user/" + user.username}>
              <button type="button" className="btn btn-primary">
                To Your Work
              </button>
            </Link>
            <hr/>
          </div>

          {/* note these elements will only render if they exist */}
          <div id="LeftOffAreaContent" className="row informationalContentSection container">
            {/* first row */}
            <div className="row">
              {recentWork.slice(0, 4).map((pathway) => {
                return (
                  <Link key={pathway.id} to={"pathway/" + pathway.id} className="cardNavLink col-5 card">
                    <ul>
                      <li><h5>{pathway.name}</h5></li>
                      <li><small className="text-muted">Created By {pathway.author}</small></li>
                    </ul>
                  </Link>
                  )
              })}   
            </div>
          </div>
        </div>
      }

      {/* The Starter Section */}
      <div id="StarterCardArea" className="row container informationalSection">
        <div className="row informationalHeaderSection">
          <h4>Where To Start</h4>
          <hr/>
        </div>

        <div className="row informationalContentSection">
          <StarterCard
            title="Create A Pathway"
            description="Create Your Own Pathway"
            linkPath="pathway"/>

          <StarterCard
            title="Find A Group"
            description="Join A Group to Collaborate With"
            linkPath="/explore/groups"/>

          <StarterCard 
            title="Browse Community Creations" 
            description="Look At Others Work"
            linkPath="/explore"/>
        </div>
      </div>

      <div id="ValidatedPathwayArea" className="row container informationalSection">
          <div className="row informationalHeaderSection">
            <h4 className="col pushDown">Validated Pathways</h4>
            <hr/>
          </div>

          {/* note these elements will only render if they exist */}
          <div id="LeftOffAreaContent" className="row informationalContentSection container">
            {/* first row */}
            <div className="row">
              {recentWork.map((pathway) => {
                return (
                  <Link key={pathway.id} to={"pathway/" + pathway.id} className="cardNavLink col-11 card">
                    <ul>
                      <li><h5>{pathway.name}</h5></li>
                      <li><small className="text-muted">Created By {pathway.author}</small></li>
                    </ul>
                  </Link>
                  )
              })}   
            </div>
          </div>
        </div>

      {/* Feed Section
        This will entail finding what is relevant to the user,
          Any Group posts which the user is a part of
          etc 
        
        if the user isn't signed in this will be generic
      */}
      <div id="FeedArea" className="row container informationalSection">
        <div className="row informationalHeaderSection">
          <h4>What's New</h4>
          <hr/>

          
        </div>

        <div className="row informationalContentSection">
          {/* {splashPageLoaderData.userFeed.map((pathway) => {
                return (
                  <div id="RecentWork" className="card">
                    {pathway.name}
                    By
                    {pathway.author}
                  </div>
                  )
            })}   */}
        </div>
      </div>
    </div>
  )
}


/**
 * A card component which is used to direct the user on the splash screen
 * @prop {string} title
 * @prop {string} description
 * @prop {string} linkPath 
 * @returns 
 */
const StarterCard = (props) => {
  return (
    <div className="cardLinkContainer col">
      <Link to={props.linkPath} className="card text-start cardNavLink">
        <div id="StarterCard">
          <div className="row g-0">
            <div className="col-md-4">
              <img src="..." className="img-fluid rounded-start" alt="..."/>
            </div>

            <div className="col-md-8">
              <div className="card-body">
                <h4 className="card-title">{props.title}</h4>
                <p className="card-text">{props.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}


/**
 * This feed item should be able to accomodate multiple types of news items 
 * types could include but are not limited to 
 * 1) pathway interactions such as 
 *    - pathway made 
 *    - pathway changes 
 * 2) post made 
 *    - comment on a pathway
 * @prop {string} creatorAssociated
 * @prop {Date} when
 * @prop {string} titleOfPost
 * @prop {id} attachedPathwayId
 * @returns 
 */
const NewsFeedItem = (props) => {
  return (
    <div id="NewsFeedItem">

    </div>
  )
}

export default SplashPage;
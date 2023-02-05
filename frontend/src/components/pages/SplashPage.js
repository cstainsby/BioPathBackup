
import { Link, useLoaderData } from "react-router-dom";


/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
const SplashPage = () => {

  const { pathways }  = useLoaderData(); // get data loaded from react router

  console.log("in splash " + JSON.stringify(pathways))

  return (
    <div id="SplashPage" className="container">
      <h1>Biopath</h1>
      <p>A Biochemistry Interactive Learning Tool</p>

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
            description="Discover what the Biopath Community is up to"
            linkPath="/explore"/>
        </div>
      </div>


      {/* Pick up where you left off section
        Note: this should only display if the user is signed in */}
      <div id="LeftOffArea" className="row container informationalSection">
        <div className="row informationalHeaderSection">
          <h4>Where You Left Off</h4>
          <hr/>
        </div>

        <div className="row informationalContentSection">
          
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
      <Link to={props.linkPath} className="cardNavLink">
        <div id="StarterCard" className="card text-start">
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
 * 
 * @param {*} props 
 * @returns 
 */
const PathwayInformationalCard = (props) => {
  return (
    <div id="PathwayHeaderCard">

    </div>
  );
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
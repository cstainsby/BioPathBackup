
import { Link } from "react-router-dom";


/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
const SplashPage = () => {
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
            className="col"
            title="Create A Pathway"
            description="Create Your Own Pathway"
            linkPath="pathway"/>

          <StarterCard
            className="col"
            title="Find A Group"
            description="Join A Group to Collaborate With"
            linkPath="/explore/groups"/>

          <StarterCard 
            className="col"
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
          <StarterCard
            className="col"
            title="Create A Pathway"
            description="Create Your Own Pathway"
            linkPath="pathway"/>

          <StarterCard
            className="col"
            title="Find A Group"
            description="Join A Group to Collaborate With"
            linkPath="/explore/groups"/>

          <StarterCard 
            className="col"
            title="Browse Community Creations" 
            description="Discover what the Biopath Community is up to"
            linkPath="/explore"/>
        </div>
      </div>


      {/* Feed Section
        This will entail finding what is relevant to the user,
          Any Group posts which the user is a part of
          etc 
        
        if the user isn't signed in this will be generic
      */}
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
    <div id="StarterCard" class="card text-start">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="..." class="img-fluid rounded-start" alt="..."/>
        </div>

        <div class="col-md-8">
          <div className="card-body">
            <h4 class="card-title">{props.title}</h4>
            <p class="card-text">{props.description}</p>
            <Link to={props.linkPath} class="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const PathwayInformationalCard = (props) => {

}

export default SplashPage;
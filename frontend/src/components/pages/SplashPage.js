import React, {useContext, useEffect, useState} from "react"
import { Link, useLoaderData } from "react-router-dom";

import UserContext from "../../UserContext";

/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
const SplashPage = () => {
    const splashPageLoaderData = useLoaderData() // get data loaded from react router

    // const { user, setUser } = useContext(UserContext);

    // const [recentWork, setRecentWork] = useState(null);
    // const [feed, setFeed] = useState(null);
    const user = {
        username: "Zach"
    }
    return (
        <div className="container">
            <div className="fs-1">Biopath</div>
            <p>A Biochemistry Interactive Learning Tool</p>

            {/* Pick up where you left off section
                Note: this should only display if the user is signed in */}
            { user && 
                <div className="container">
                    <div className="row justify-content-between border-bottom border-2 border-secondary py-2">
                        <div className="fs-3 col-auto">Jump Back In</div>
                        <Link className="btn btn-primary col-auto me-2" to={"user/" + user.username}>To Your Work</Link>
                    </div>

                    <div className="row pt-2 mx-sm-2">
                    {splashPageLoaderData.recentWork.slice(0, 4).map((pathway) => {
                        return (
                        <Link key={pathway.id} to={"pathway/" + pathway.id} className="col-auto card text-decoration-none mx-1 px-3 py-2">
                            <div className="fs-4">{pathway.name}</div>
                            <small className="text-muted">Created By {pathway.author}</small>
                        </Link>
                        )
                    })}   
                    </div>
                </div>
            }

            <div className="container">
                <div className="row border-bottom border-2 border-secondary py-2">
                    <div className="col-auto fs-3">Validated Pathways</div>
                </div>
                {splashPageLoaderData.recentWork.map((pathway) => {
                    return (
                    <Link key={pathway.id} to={"pathway/" + pathway.id} className="row card text-decoration-none m-1 p-1 m-sm-2 p-sm-2">
                        <div className="fs-4">{pathway.name}</div>
                        <small className="text-muted">Created By {pathway.author}</small>
                    </Link>
                    )
                })}
            </div>

            {/* The Starter Section */}
            <div id="StarterCardArea" className="row container informationalSection">
            <div className="row border-bottom border-2 border-secondary py-2">
                    <div className="col-auto fs-3">Where To Start</div>
                </div>

                <div className="row informationalContentSection">
                <StarterCard
                    title="Create A Pathway"
                    description="Create Your Own Pathway"
                    linkPath="build"/>

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

            {/* Feed Section
                This will entail finding what is relevant to the user,
                Any Group posts which the user is a part of
                etc 
                
                if the user isn't signed in this will be generic
            */}
            {/* <div id="FeedArea" className="row container informationalSection">
                <div className="row informationalHeaderSection">
                    <h4>What's New</h4>
                    <hr/>
                </div>

                <div className="row informationalContentSection">
                    // {splashPageLoaderData.userFeed.map((pathway) => {
                    //     return (
                    //     <div id="RecentWork" className="card">
                    //         {pathway.name}
                    //         By
                    //         {pathway.author}
                    //     </div>
                    //     )
                    // })}  
                </div>
            </div> */}
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
                                <img className="img-fluid rounded-start" alt="..."/>
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
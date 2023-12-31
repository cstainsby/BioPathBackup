import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import UserContext from '../UserContext';

/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
function SplashPage() {
    const splashPageLoaderData = useLoaderData(); // get data loaded from react router
    const { user, setUser } = useContext(UserContext);

    return (
        <div className="container">
            <div className="fs-1">Biopath</div>
            <div className="fs-5">A Biochemistry Interactive Learning Tool</div>

            {/* Pick up where you left off section
                Note: this should only display if the user is signed in */}
            {user && (
                <div className="container">
                    <div className="row justify-content-between border-bottom border-2 border-secondary py-2">
                        <div className="fs-3 col-auto">Jump Back In</div>
                        <Link
                            className="btn btn-primary col-auto me-2"
                            to={'user/' + user.username}
                        >
                            To Your Work
                        </Link>
                    </div>

                    {splashPageLoaderData.recentWork && (
                        <div className="row pt-2 mx-sm-2">
                            {splashPageLoaderData.recentWork
                                .slice(0, 4)
                                .map((pathway) => {
                                    return (
                                        <Link
                                            key={pathway.id}
                                            to={'pathway/' + pathway.id}
                                            className="col-auto card text-decoration-none mx-1 px-3 py-2"
                                        >
                                            <div className="fs-4">
                                                {pathway.name}
                                            </div>
                                            <small className="text-muted">
                                                Created By {pathway.author}
                                            </small>
                                        </Link>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}

            <div className="container">
                <div className="row border-bottom border-2 border-secondary py-2">
                    <div className="col-auto fs-3">Validated Pathways</div>
                </div>
                {splashPageLoaderData.recentWork &&
                    splashPageLoaderData.recentWork.map((pathway) => {
                        return (
                            <Link
                                key={pathway.id}
                                to={'pathway/' + pathway.id}
                                className="row card text-decoration-none m-1 p-1 m-sm-2 p-sm-2"
                            >
                                <div className="fs-4 fw-bold">
                                    {pathway.name}
                                </div>
                                <small className="text-muted">
                                    Created By {pathway.author}
                                </small>
                            </Link>
                        );
                    })}
            </div>

            {/* The Starter Section */}
            <div className="container">
                <div className="row border-bottom border-2 border-secondary py-2">
                    <div className="col-auto fs-3">Where To Start</div>
                </div>

                <div className="row py-2 mx-sm-2">
                    <div className="col p-0">
                        <StarterCard
                            title="Create A Pathway"
                            description="Create Your Own Pathway"
                            linkPath="build"
                        />
                    </div>
                    {/* TODO: Add groups/classrooms */}
                    {/* <div className="col p-0">
                        <StarterCard
                            title="Find A Group"
                            description="Not Implimented"
                            linkPath="/explore/groups"/>
                    </div>*/}
                    {/* TODO: Add Community Creations */}
                    {/* <div className="col p-0">
                        <StarterCard 
                            title="Browse Community Creations" 
                            description="Not Implimented"
                            linkPath="/explore"/>
                    </div>  */}
                </div>
            </div>
        </div>
    );
}

/**
 * A card component which is used to direct the user on the splash screen
 * @prop {string} title
 * @prop {string} description
 * @prop {string} linkPath
 * @returns
 */
function StarterCard({ linkPath, title, description }) {
    return (
        <Link
            to={linkPath}
            className="card h-100 text-start text-decoration-none"
        >
            <div className="row g-0">
                <div className="card-body">
                    <div className="fs-3">{title}</div>
                    <div className="card-text">{description}</div>
                </div>
            </div>
        </Link>
    );
}

export default SplashPage;

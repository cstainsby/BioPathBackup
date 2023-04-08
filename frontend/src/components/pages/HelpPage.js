import Help from "./Help";

// TODO: Add Help information
const HelpPage = () => {

    const bulletStyle = {
        "list-style-type": "disc"
      };

    return (
        <div>
            <header>
                <meta charset="UTF-8"/>
                <title>Help Page</title>
            </header>
            <body>
                <h1>Help</h1>
                
                <h2>FAQs</h2>
                <ul>
                    <li>
                        <h3>How do I save a new Pathway</h3>
                            <ul>
                                <li>
                                    <p>To save a new pathway, you must first be signed into an account.</p>
                                </li>
                                <li>
                                    <p>Then you must build the pathway with the correct substrates/products/cofactors for each enzyme.</p>
                                </li>
                                <li>
                                    <p>Finally, click Save As and enter a title for the pathway followed by clicking the submit button.</p>
                                </li>

                            </ul>
                    </li>
                    <li>
                        <h3>How to delete nodes when using the build tool</h3>
                        <p>To delete a node, click on the node you want to delete, then click confirm</p>
                    </li>
                    <li>
                        <h3>How to lock molecule concentrations in the model view</h3>
                        <p>To lock a molecule concentration, click on the molecule you want to lock, the molecule will be outlined if successful.</p>
                    </li>
                </ul>
                
                <h2>Contact Us</h2>
                <p>If you have any questions or issues, please contact us at <a href="https://www.reddit.com/user/BenjamanSnatch22/comments/12f4qwq/biopath_forums/">BioPath Reddit Forum</a>.</p>
            </body>
        </div>
    )
}

export default HelpPage;
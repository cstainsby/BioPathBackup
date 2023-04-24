import { useState } from "react";

const ExplorePage = (pages) => {
    const paginationButtonNames = ["Pathways", "Groups", "Users"];

    let [selectedExploreType, setSelectedExploreType] = useState("");

    const handlePaginationButtonClick = (buttonName) => {
        if (selectedExploreType === buttonName) {
            setSelectedExploreType("");
        } else {
            setSelectedExploreType(buttonName);
        }
    };

    return (
        <div id="ExplorePage">
            <h1>Explore</h1>

            <nav>
                <ul class="pagination pagination-sm">
                    {paginationButtonNames.map((buttonName) => {
                        let className = "page-item";

                        if (selectedExploreType === buttonName)
                            className += " active";

                        return (
                            <li
                                className={className}
                                aria-current="page"
                                onClick={() =>
                                    handlePaginationButtonClick(buttonName)
                                }
                            >
                                <button class="page-link">{buttonName}</button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div class="input-group mb-3">
                <span class="input-group-text active">$</span>
                <span class="input-group-text">0.00</span>
                <input type="text" class="form-control" placeholder="Search" />
            </div>
        </div>
    );
};

export default ExplorePage;

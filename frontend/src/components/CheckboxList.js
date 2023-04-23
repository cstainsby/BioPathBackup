import React, { useState, useEffect } from "react";

/**
 * Generic Checkbox list component for user input
 *
 * @prop {options} list list of items for the checkboxlist
 * @prop {onSelectionChange} function function to change state in parent
 * @prop {listname} string identifies list
 */
function CheckboxList({ options, onSelectionChange, listName }) {
    const [checked, setChecked] = useState(Array(options.length).fill(false));

    useEffect(() => {
        onSelectionChange(checked);
    }, [checked]);

    function handleCheckboxChange(event) {
        const value = Number(event.target.value);
        setChecked((oldChecked) => {
            let copy = [...oldChecked];
            copy[value] = !copy[value];
            return copy;
        });
    }

    return (
        <div className="dropdown">
            <button
                className="btn dropdown-toggle"
                id="checkboxDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-bs-toggle="dropdown"
            >
                {listName}
            </button>
            <div className="dropdown-menu" aria-labelledby="checkboxDropdown">
                {options.map((item, index) => (
                    <label className="dropdown-item fs-6" key={index}>
                        <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value={index}
                            checked={checked[index]}
                            onChange={handleCheckboxChange}
                        />
                        {item["name"]}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CheckboxList;

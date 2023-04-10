import React, { useState, useEffect } from "react";

function CheckboxList({ options, onSelectionChange, listName }) {
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        onSelectionChange(checked);
    }, [checked]);

    function handleCheckboxChange(event) {
        const value = event.target.value;
        if (checked.includes(value)) {
            setChecked(checked.filter(item => item !== value));
        } else {
            setChecked([...checked, value]);
        }
    }

    return (
        <div class="dropdown-submenu">
            <a class="dropdown-item" href="#">
                {listName}
            </a>
            <ul class="dropdown-menu dropdown-checkbox">
                {options.map((item, index) => (
                    <li>
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={index}
                                checked={checked.includes(index.toString())}
                                onChange={handleCheckboxChange}
                            />
                            {item["name"]}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckboxList;

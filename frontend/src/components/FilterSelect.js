import React, { useState, useEffect } from "react";

function FilteredSelect({ options, selectFunction, filterType }) {
    const [selectedOption, setSelectedOption] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        const index = options.findIndex((item) => item.name === selectedOption);
        selectFunction(index);
    }, [selectedOption]);

    function handleInputChange(event) {
        const inputValue = event.target.value;
        const filtered = options.filter((options) =>
            options.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption.target.value);
    }

    return (
        <div>
            <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={handleInputChange}
            />
            <select
                className="form-select m-1"
                value={selectedOption}
                onChange={handleChange}
            >
                <option selected disabled hidden>
                    Select {filterType}
                </option>
                {filteredOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default FilteredSelect;

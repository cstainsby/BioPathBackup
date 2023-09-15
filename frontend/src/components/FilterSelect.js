import React, { useState, useEffect } from 'react';

/**
 * Component that allows user to filter a list based on user input
 *
 * @param props
 * @prop options list
 * @prop selectFunction function
 * @prop filterType String
 */
/**
 * Select list with filter textbox. Calls selectFunction when a selection is made
 */
function FilteredSelect({ options, selectFunction, filterType }) {
    // The selected option returns a string so this type needs to
    // be a string. Useful to put the default value here so that the
    // <select> shows our temp message. See that I'm making sure not
    // to pass this into selectFuntion in the useEffect() - Zach
    const [selectedOptionIndex, setSelectedOption] = useState(
        'Select ' + filterType
    );
    const [textInput, setTextInput] = useState('');

    useEffect(() => {
        if (selectedOptionIndex !== 'Select ' + filterType) {
            selectFunction(Number(selectedOptionIndex));
        }
    }, [selectedOptionIndex]);

    function onTextInputChange(event) {
        setTextInput(event.target.value);
    }
    return (
        <div>
            <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={onTextInputChange}
            />
            <select
                className="form-select m-1"
                value={selectedOptionIndex}
                onChange={(selection) =>
                    setSelectedOption(selection.target.value)
                }
            >
                <option value={'Select ' + filterType} disabled hidden>
                    Select {filterType}
                </option>
                {options.length !== 0 &&
                    options.map((option, index) => {
                        if (
                            option.name
                                .toLowerCase()
                                .includes(textInput.toLowerCase())
                        ) {
                            return (
                                <option key={option.id} value={index}>
                                    {option.name}
                                </option>
                            );
                        }
                    })}
            </select>
        </div>
    );
}

export default FilteredSelect;

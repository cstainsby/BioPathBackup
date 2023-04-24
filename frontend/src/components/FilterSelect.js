import React, { useState, useEffect } from 'react';

/**
 * Component that allows user to filter a list based on user input
 * 
 * @param props
 * @prop options list
 * @prop selectFunction function
 * @prop filterType String
 */
function FilteredSelect(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(props.options);
  const [options, setOptions] = useState(props.options)


  useEffect(() => {
    setOptions(props.options)
    setFilteredOptions(props.options)
    const index = options.findIndex((item) => item.name === selectedOption);
    props.selectFunction(index)
  }, [props.options, selectedOption]);

  function handleInputChange(event) {
    const inputValue = event.target.value;
    const filtered = options.filter(options =>
      options.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }

  function handleChange(selectedOption) {
    setSelectedOption(selectedOption.target.value);
  }

  return (
    <div>
      <input type="text" class="form-control" placeholder="Search" onChange={handleInputChange} />
      <select class="form-select m-1" value={selectedOption} onChange={handleChange}>
        <option selected disabled hidden>Select {props.filterType}</option>
        {filteredOptions.map(option => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilteredSelect;

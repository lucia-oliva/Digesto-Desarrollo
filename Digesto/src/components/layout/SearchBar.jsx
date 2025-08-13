import { useState, useRef, useEffect } from 'react';
import useAxios from "axios-hooks";
import PropTypes from "prop-types";

function SearchBar({onSearch}) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [{ data }] = useAxios("http://localhost:3000/api/tag/tags");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    

    if (value.length >= 2) {
      const filtered = data.tags.filter((option) =>
        option.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered.slice(0, 8));
    }

    setIsListVisible(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.nombre);   
    onSearch(option.nombre);
    setIsListVisible(false);       
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)) {
      setIsListVisible(false);
    }
  };

  const handleKeyPress =(e) => {
    if (e.key === 'Enter' || inputValue.trim() == '') {
      onSearch(inputValue);
      setIsListVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-start relative z-10">
      <label className="input flex items-center gap-2">
        <button
          type="button"
          className="text-gray-500 hover:text-primary"
          onClick={() => {
            if (inputValue.trim() !== "") {
              onSearch(inputValue);
              setIsListVisible(false);
            }
          }}
        >
          <svg
            className="h-[1.2em] w-[1.2em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsListVisible(true)}
          onKeyPress={handleKeyPress}
          required
          placeholder="Buscar por tags..."
          className="flex-1"
        />
      </label>
      {inputValue && isListVisible && filteredOptions.length > 0 && (
        <ul ref={listRef} id='options' className="options-list mt-2 w-full p-0 m-0 absolute left-0 top-full">
          {filteredOptions.map((option, index) => (
            <li key={index} className="option-item">
              <button
                className="w-full text-left text-black text-sm bg-blue-200 hover:bg-blue-300 p-2"
                onClick={() => handleOptionClick(option)} 
              >
                {option.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  dependencia: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  dependenciaMap: PropTypes.object.isRequired,
  anio: PropTypes.number,
  documento: PropTypes.number,
  emisor: PropTypes.number,
  numero: PropTypes.string,
  onFormChange: PropTypes.func,
};


export default SearchBar;

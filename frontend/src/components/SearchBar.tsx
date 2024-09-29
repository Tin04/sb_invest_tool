import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import '../styles/SearchBar.css';

interface Suggestion {
  name: string;
  id: string;
  type: string;
  iconUrl: string;
  img: string;
  tier: string;
}

interface SearchBarProps {
  onSelect: (item: Suggestion) => void;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, name, value, onChange }) => {
  // const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (value) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value]);

  const fetchSuggestions = async (value: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://sky.coflnet.com/api/search/${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Suggestion[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setActiveSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // setSearchTerm(suggestion.name);
    setSuggestions([]);
    onSelect(suggestion);
    // You can add additional action here, like redirecting to item page
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter' && activeSuggestion !== -1) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        id={`search-input-${name}`}
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search items..."
      />
      {isLoading && <div className="loading" aria-live="polite">Loading...</div>}
      {suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((item, index) => (
            <div
              key={item.id}
              className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
              onClick={() => handleSuggestionClick(item)}
            >
              <img
                src={item.iconUrl || item.img}
                alt={item.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'default-icon.png';
                }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

/*
How to integrate search bar

--- Functions ---
  const handleItemSelect = (item: Suggestion) => {
    setFormData(prevData => ({
      ...prevData,
      itemName: item.name,
      itemTag: item.id,
      // You can also set other fields based on the selected item if needed
      // For example: itemTag: item.type,
    }));
    setSearchValue(item.name);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFormData(prevData => ({
      ...prevData,
      itemName: value,
    }));
  };

--- Render UI ---
  <SearchBar
    name="item"
    value={searchTerm}
    onChange={setSearchTerm}
    onSelect={handleSelect}
  />

*/
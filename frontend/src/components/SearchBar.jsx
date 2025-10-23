import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { perfumeApi } from '../services/api';

const SearchBar = ({ onSearch, onSelectPerfume }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await perfumeApi.getPerfumes({ search: query });
        setSuggestions(response.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (perfume) => {
    setQuery(perfume.name);
    setShowSuggestions(false);
    onSelectPerfume(perfume);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    onSearch('');
  };
  
  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a perfume (e.g., Dior Sauvage)..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-primary-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 text-lg shadow-lg"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-primary-100 overflow-hidden z-50">
          {suggestions.map((perfume) => (
            <button
              key={perfume.id}
              onClick={() => handleSuggestionClick(perfume)}
              className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary-100 flex-shrink-0">
                <img
                  src={perfume.image_url}
                  alt={perfume.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{perfume.name}</p>
                <p className="text-sm text-primary-600">{perfume.brand}</p>
              </div>
              <div className="text-xs text-gray-500">
                {perfume.family}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {showSuggestions && loading && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-primary-100 p-4 text-center text-gray-500">
          Loading suggestions...
        </div>
      )}
    </div>
  );
};

export default SearchBar;

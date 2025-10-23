import React, { useState, useEffect, useCallback } from 'react';
import { perfumeApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import { Droplets, X, Search, Filter } from 'lucide-react';

const FindByNotes = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    families: [],
    genders: [],
  });
  const [filters, setFilters] = useState({
    gender: 'All',
    family: 'All',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    loadNotes();
    loadFilters();
  }, []);
  
  const loadNotes = async () => {
    try {
      const response = await perfumeApi.getNotes();
      setAllNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };
  
  const loadFilters = async () => {
    try {
      const response = await perfumeApi.getFilters();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };
  
  const handleFindPerfumes = useCallback(async () => {
    if (selectedNotes.length === 0) {
      setRecommendations([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await perfumeApi.getRecommendationsByNotes(
        selectedNotes,
        {
          limit: 50,
          gender: filters.gender !== 'All' ? filters.gender : undefined,
          family: filters.family !== 'All' ? filters.family : undefined,
        }
      );
      setRecommendations(response.data);
      
      // Scroll to results on first selection
      if (selectedNotes.length === 1) {
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error finding perfumes:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedNotes, filters.gender, filters.family]);
  
  // Auto-search when notes or filters change
  useEffect(() => {
    handleFindPerfumes();
  }, [handleFindPerfumes]);
  
  const toggleNote = (noteName) => {
    if (selectedNotes.includes(noteName)) {
      setSelectedNotes(selectedNotes.filter(n => n !== noteName));
    } else {
      setSelectedNotes([...selectedNotes, noteName]);
    }
  };
  
  const toggleFavorite = (perfumeId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(perfumeId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(perfumeId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setRecommendations([...recommendations]);
  };
  
  const clearSelection = () => {
    setSelectedNotes([]);
    setRecommendations([]);
  };
  
  // Group notes by type
  const notesByType = {
    top: allNotes.filter(n => n.type === 'top'),
    middle: allNotes.filter(n => n.type === 'middle'),
    base: allNotes.filter(n => n.type === 'base'),
  };
  
  // Filter notes by search query
  const filteredNotesByType = {
    top: notesByType.top.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())),
    middle: notesByType.middle.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())),
    base: notesByType.base.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())),
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-2xl">
              <Droplets className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find Perfumes by Notes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on notes to instantly filter perfumes. Add more notes to narrow down your search.
          </p>
        </div>
        
        {/* Selected Notes */}
        {selectedNotes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Active Filters ({selectedNotes.length} note{selectedNotes.length > 1 ? 's' : ''})
                {loading && <span className="ml-3 text-sm text-primary-600 animate-pulse">● Filtering...</span>}
                {!loading && recommendations.length > 0 && (
                  <span className="ml-3 text-sm text-green-600">
                    ✓ {recommendations.length} perfume{recommendations.length > 1 ? 's' : ''} found
                  </span>
                )}
              </h3>
              <button
                onClick={clearSelection}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNotes.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleNote(note)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                >
                  <span>{note}</span>
                  <X className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Additional Filters</span>
              </button>
              
              <p className="text-sm text-gray-500">
                Click more notes to narrow down results
              </p>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                      className="input-field"
                    >
                      <option value="All">All</option>
                      {filterOptions.genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Olfactory Family
                    </label>
                    <select
                      value={filters.family}
                      onChange={(e) => setFilters({ ...filters, family: e.target.value })}
                      className="input-field"
                    >
                      <option value="All">All</option>
                      {filterOptions.families.map((family) => (
                        <option key={family} value={family}>
                          {family}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Notes Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Top Notes */}
            {filteredNotesByType.top.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                  <span className="text-lg">Top Notes</span>
                  <span className="text-sm text-gray-500 font-normal">
                    (First impression)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filteredNotesByType.top.map((note) => (
                    <button
                      key={note.name}
                      onClick={() => toggleNote(note.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedNotes.includes(note.name)
                          ? 'bg-yellow-400 text-yellow-900 shadow-md transform scale-105'
                          : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                      }`}
                    >
                      {note.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Middle Notes */}
            {filteredNotesByType.middle.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-pink-400"></span>
                  <span className="text-lg">Heart Notes</span>
                  <span className="text-sm text-gray-500 font-normal">
                    (Main character)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filteredNotesByType.middle.map((note) => (
                    <button
                      key={note.name}
                      onClick={() => toggleNote(note.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedNotes.includes(note.name)
                          ? 'bg-pink-400 text-pink-900 shadow-md transform scale-105'
                          : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
                      }`}
                    >
                      {note.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Base Notes */}
            {filteredNotesByType.base.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-purple-400"></span>
                  <span className="text-lg">Base Notes</span>
                  <span className="text-sm text-gray-500 font-normal">
                    (Long-lasting foundation)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filteredNotesByType.base.map((note) => (
                    <button
                      key={note.name}
                      onClick={() => toggleNote(note.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedNotes.includes(note.name)
                          ? 'bg-purple-400 text-purple-900 shadow-md transform scale-105'
                          : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                      }`}
                    >
                      {note.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        {loading && selectedNotes.length > 0 && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Filtering perfumes...</p>
          </div>
        )}
        
        {!loading && recommendations.length > 0 && (
          <div id="results">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-800">
                {recommendations.length} Perfume{recommendations.length > 1 ? 's' : ''} Found
              </h2>
              {recommendations.length > 0 && selectedNotes.length > 1 && (
                <p className="text-sm text-gray-500">
                  Contains all {selectedNotes.length} selected notes
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  showSimilarity={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
        
        {!loading && selectedNotes.length > 0 && recommendations.length === 0 && (
          <div id="results" className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-800 text-xl font-semibold mb-2">
              No perfumes found
            </p>
            <p className="text-gray-600">
              No perfumes contain all {selectedNotes.length} selected notes together.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try removing some notes or selecting different combinations.
            </p>
          </div>
        )}
        
        {/* Initial State */}
        {selectedNotes.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-primary-50 to-pink-50 rounded-2xl">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-gray-700 text-lg font-medium mb-2">
              Click any note above to start filtering
            </p>
            <p className="text-gray-500">
              Results will appear instantly as you select notes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindByNotes;

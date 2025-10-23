import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PerfumeCard from '../components/PerfumeCard';
import { perfumeApi } from '../services/api';
import { Sparkles, Filter, Shuffle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'All',
    family: 'All',
  });
  const [filterOptions, setFilterOptions] = useState({
    families: [],
    genders: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    loadPerfumes();
    loadFilters();
  }, []);
  
  useEffect(() => {
    loadPerfumes();
  }, [filters]);
  
  const loadPerfumes = async () => {
    setLoading(true);
    try {
      const response = await perfumeApi.getPerfumes(filters.gender !== 'All' || filters.family !== 'All' ? filters : {});
      setPerfumes(response.data);
    } catch (error) {
      console.error('Error loading perfumes:', error);
    } finally {
      setLoading(false);
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
  
  const handleSearch = async (query) => {
    if (!query) {
      setRecommendations([]);
      setSelectedPerfume(null);
      loadPerfumes();
      return;
    }
    
    setLoading(true);
    try {
      const response = await perfumeApi.getPerfumes({ search: query });
      setPerfumes(response.data);
    } catch (error) {
      console.error('Error searching perfumes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectPerfume = async (perfume) => {
    setSelectedPerfume(perfume);
    setLoading(true);
    
    try {
      const response = await perfumeApi.getRecommendations(perfume.id, 8);
      setRecommendations(response.data);
      
      // Scroll to recommendations
      setTimeout(() => {
        document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const response = await perfumeApi.getRandomPerfume();
      handleSelectPerfume(response.data);
    } catch (error) {
      console.error('Error getting random perfume:', error);
    } finally {
      setLoading(false);
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
    
    // Force re-render
    setPerfumes([...perfumes]);
    setRecommendations([...recommendations]);
  };
  
  const displayPerfumes = recommendations.length > 0 ? recommendations : perfumes;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Find Perfumes You'll Love
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover your perfect scent by searching for perfumes similar to ones you already love
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <SearchBar
              onSearch={handleSearch}
              onSelectPerfume={handleSelectPerfume}
            />
            
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/find-by-notes')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Find by Notes</span>
              </button>
              
              <button
                onClick={handleSurpriseMe}
                className="btn-secondary flex items-center space-x-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>Surprise Me</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
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
      </div>
      
      {/* Selected Perfume Info */}
      {selectedPerfume && (
        <div className="bg-primary-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Finding perfumes similar to</p>
              <h2 className="font-display text-3xl font-bold text-primary-800">
                {selectedPerfume.name} by {selectedPerfume.brand}
              </h2>
            </div>
          </div>
        </div>
      )}
      
      {/* Perfumes Grid */}
      <div id="recommendations" className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading perfumes...</p>
          </div>
        ) : displayPerfumes.length > 0 ? (
          <>
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-8">
              {recommendations.length > 0 ? 'Recommended For You' : 'All Perfumes'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  showSimilarity={recommendations.length > 0}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No perfumes found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

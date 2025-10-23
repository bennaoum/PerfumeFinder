import React, { useState, useEffect } from 'react';
import { perfumeApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      // Fetch all perfumes and filter by favorites
      const response = await perfumeApi.getPerfumes();
      const favoritePerfumes = response.data.filter(p => favoriteIds.includes(p.id));
      setFavorites(favoritePerfumes);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFavorite = (perfumeId) => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favoriteIds.indexOf(perfumeId);
    
    if (index > -1) {
      favoriteIds.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
      
      // Remove from displayed favorites
      setFavorites(favorites.filter(p => p.id !== perfumeId));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-2xl">
              <Heart className="w-12 h-12 text-red-500 fill-red-500" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Favorite Perfumes
          </h1>
          <p className="text-xl text-gray-600">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'perfume' : 'perfumes'}`
              : 'Start adding perfumes to your favorites'}
          </p>
        </div>
        
        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                You haven't added any favorites yet
              </p>
              <p className="text-gray-500 mb-6">
                Browse perfumes and click the heart icon to save them here
              </p>
              <a href="/" className="btn-primary inline-block">
                Discover Perfumes
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

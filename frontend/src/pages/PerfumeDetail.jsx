import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { perfumeApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import { Heart, ArrowLeft, Calendar, Users, Palette } from 'lucide-react';

const PerfumeDetail = () => {
  const { id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    loadPerfume();
    loadRecommendations();
    checkFavorite();
  }, [id]);
  
  const loadPerfume = async () => {
    try {
      const response = await perfumeApi.getPerfume(id);
      setPerfume(response.data);
    } catch (error) {
      console.error('Error loading perfume:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadRecommendations = async () => {
    try {
      const response = await perfumeApi.getRecommendations(id, 8);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };
  
  const checkFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
  };
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const perfumeId = parseInt(id);
    const index = favorites.indexOf(perfumeId);
    
    if (index > -1) {
      favorites.splice(index, 1);
      setIsFavorite(false);
    } else {
      favorites.push(perfumeId);
      setIsFavorite(true);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };
  
  const handleToggleFavoriteCard = (perfumeId) => {
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading perfume details...</p>
        </div>
      </div>
    );
  }
  
  if (!perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Perfume not found</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const topNotes = perfume.notes?.filter(n => n.type === 'top') || [];
  const middleNotes = perfume.notes?.filter(n => n.type === 'middle') || [];
  const baseNotes = perfume.notes?.filter(n => n.type === 'base') || [];
  
  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Search</span>
        </Link>
      </div>
      
      {/* Perfume Details */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-96 lg:h-auto">
              <img
                src={perfume.image_url}
                alt={perfume.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Info */}
            <div className="p-8 lg:p-12">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary-600 font-semibold text-lg mb-2">
                    {perfume.brand}
                  </p>
                  <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                    {perfume.name}
                  </h1>
                </div>
                
                <button
                  onClick={toggleFavorite}
                  className="btn-secondary p-3"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {perfume.description}
              </p>
              
              {/* Meta Info */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-semibold text-gray-800">{perfume.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800">{perfume.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Family</p>
                    <p className="font-semibold text-gray-800 text-sm">{perfume.family}</p>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="space-y-6">
                {topNotes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span>Top Notes</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {topNotes.map((note, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full text-sm font-medium"
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {middleNotes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                      <span>Heart Notes</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {middleNotes.map((note, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-pink-50 text-pink-800 rounded-full text-sm font-medium"
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {baseNotes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                      <span>Base Notes</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {baseNotes.map((note, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-purple-50 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Perfumes */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-8">
              Similar Perfumes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <PerfumeCard
                  key={rec.id}
                  perfume={rec}
                  showSimilarity={true}
                  onToggleFavorite={handleToggleFavoriteCard}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfumeDetail;

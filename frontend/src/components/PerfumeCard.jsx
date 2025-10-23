import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const PerfumeCard = ({ perfume, showSimilarity = false, onToggleFavorite }) => {
  const isFavorite = localStorage.getItem('favorites')?.includes(perfume.id.toString());
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(perfume.id);
  };
  
  const topNotes = perfume.notes?.filter(n => n.type === 'top').slice(0, 3) || [];
  
  return (
    <Link to={`/perfume/${perfume.id}`}>
      <div className="card group cursor-pointer transform hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
          <img
            src={perfume.image_url}
            alt={perfume.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          />
          
          {showSimilarity && perfume.similarity_score !== undefined && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>{Math.round(perfume.similarity_score * 100)}% Match</span>
            </div>
          )}
          
          {showSimilarity && perfume.match_score !== undefined && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>{Math.round(perfume.match_score * 100)}% Match</span>
            </div>
          )}
          
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-2">
            <h3 className="font-display text-xl font-semibold text-gray-800 mb-1">
              {perfume.name}
            </h3>
            <p className="text-primary-600 font-medium">{perfume.brand}</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
              {perfume.family}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {perfume.gender}
            </span>
          </div>
          
          {topNotes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Top Notes</p>
              <div className="flex flex-wrap gap-1">
                {topNotes.map((note, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full"
                  >
                    {note.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {showSimilarity && perfume.shared_notes && perfume.shared_notes.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Shared notes:</p>
              <p className="text-sm text-primary-700 font-medium">
                {perfume.shared_notes.slice(0, 3).join(', ')}
                {perfume.shared_notes.length > 3 && '...'}
              </p>
            </div>
          )}
          
          {showSimilarity && perfume.matching_notes && perfume.matching_notes.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Matching notes:</p>
              <p className="text-sm text-primary-700 font-medium">
                {perfume.matching_notes.slice(0, 3).join(', ')}
                {perfume.matching_notes.length > 3 && '...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PerfumeCard;

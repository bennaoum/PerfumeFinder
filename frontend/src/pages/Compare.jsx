import React, { useState, useEffect } from 'react';
import { perfumeApi } from '../services/api';
import { GitCompare, X, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compare = () => {
  const [allPerfumes, setAllPerfumes] = useState([]);
  const [selectedPerfumes, setSelectedPerfumes] = useState([null, null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(null);
  
  useEffect(() => {
    loadPerfumes();
  }, []);
  
  const loadPerfumes = async () => {
    try {
      const response = await perfumeApi.getPerfumes();
      setAllPerfumes(response.data);
    } catch (error) {
      console.error('Error loading perfumes:', error);
    }
  };
  
  const filteredPerfumes = allPerfumes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectPerfume = (perfume, index) => {
    const newSelected = [...selectedPerfumes];
    newSelected[index] = perfume;
    setSelectedPerfumes(newSelected);
    setShowSearch(null);
    setSearchQuery('');
  };
  
  const removePerfume = (index) => {
    const newSelected = [...selectedPerfumes];
    newSelected[index] = null;
    setSelectedPerfumes(newSelected);
  };
  
  const getComparisonData = () => {
    const selected = selectedPerfumes.filter(p => p !== null);
    if (selected.length < 2) return null;
    
    // Find shared notes
    const allNotes = selected.map(p => p.notes.map(n => n.name));
    const shared = allNotes[0].filter(note => 
      allNotes.every(notes => notes.includes(note))
    );
    
    return { shared, selected };
  };
  
  const comparison = getComparisonData();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-2xl">
              <GitCompare className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Compare Perfumes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select up to 3 perfumes to compare side by side
          </p>
        </div>
        
        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {selectedPerfumes.map((perfume, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 min-h-[300px]">
              {perfume ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Perfume {index + 1}</h3>
                    <button
                      onClick={() => removePerfume(index)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1">{perfume.name}</h4>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">{perfume.brand}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{perfume.year}</span>
                    <span>•</span>
                    <span>{perfume.gender}</span>
                    <span>•</span>
                    <span>{perfume.family}</span>
                  </div>
                  <Link
                    to={`/perfume/${perfume.id}`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View Details →
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setShowSearch(index)}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Plus className="w-16 h-16 mb-4" />
                  <span className="text-lg font-medium">Add Perfume {index + 1}</span>
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Search Modal */}
        {showSearch !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Select a Perfume</h3>
                  <button
                    onClick={() => setShowSearch(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search perfumes..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[500px] p-4">
                {filteredPerfumes.map((perfume) => (
                  <button
                    key={perfume.id}
                    onClick={() => selectPerfume(perfume, showSearch)}
                    className="w-full flex items-center space-x-4 p-4 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    disabled={selectedPerfumes.some(p => p?.id === perfume.id)}
                  >
                    <img src={perfume.image_url} alt={perfume.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">{perfume.name}</h4>
                      <p className="text-sm text-primary-600 dark:text-primary-400">{perfume.brand}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{perfume.year} • {perfume.gender}</p>
                    </div>
                    {selectedPerfumes.some(p => p?.id === perfume.id) && (
                      <span className="text-sm text-gray-400">Already selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Comparison Results */}
        {comparison && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Comparison Analysis</h2>
            
            {/* Shared Notes */}
            {comparison.shared.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-3">
                  Shared Notes ({comparison.shared.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {comparison.shared.map(note => (
                    <span key={note} className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Detailed Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparison.selected.map((perfume, idx) => (
                <div key={perfume.id} className="border dark:border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{perfume.name}</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Family:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">{perfume.family}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Year:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">{perfume.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">{perfume.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total Notes:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">{perfume.notes.length}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">All Notes:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {perfume.notes.map(note => (
                        <span
                          key={note.id}
                          className={`text-xs px-2 py-1 rounded ${
                            comparison.shared.includes(note.name)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;

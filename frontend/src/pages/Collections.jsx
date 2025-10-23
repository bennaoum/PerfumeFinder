import React, { useState, useEffect } from 'react';
import { perfumeApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import { FolderHeart, Plus, Trash2, Edit2, X } from 'lucide-react';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [allPerfumes, setAllPerfumes] = useState([]);
  
  useEffect(() => {
    loadCollections();
    loadPerfumes();
  }, []);
  
  const loadCollections = () => {
    const saved = localStorage.getItem('collections');
    if (saved) {
      setCollections(JSON.parse(saved));
    }
  };
  
  const loadPerfumes = async () => {
    try {
      const response = await perfumeApi.getPerfumes();
      setAllPerfumes(response.data);
    } catch (error) {
      console.error('Error loading perfumes:', error);
    }
  };
  
  const saveCollections = (newCollections) => {
    localStorage.setItem('collections', JSON.stringify(newCollections));
    setCollections(newCollections);
  };
  
  const createCollection = () => {
    if (!newCollectionName.trim()) return;
    
    const newCollection = {
      id: Date.now(),
      name: newCollectionName,
      perfumes: [],
      createdAt: new Date().toISOString(),
    };
    
    saveCollections([...collections, newCollection]);
    setNewCollectionName('');
    setShowNewCollection(false);
  };
  
  const deleteCollection = (id) => {
    if (confirm('Delete this collection?')) {
      saveCollections(collections.filter(c => c.id !== id));
      if (selectedCollection?.id === id) setSelectedCollection(null);
    }
  };
  
  const addToCollection = (collectionId, perfumeId) => {
    const updated = collections.map(c => {
      if (c.id === collectionId && !c.perfumes.includes(perfumeId)) {
        return { ...c, perfumes: [...c.perfumes, perfumeId] };
      }
      return c;
    });
    saveCollections(updated);
  };
  
  const removeFromCollection = (collectionId, perfumeId) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, perfumes: c.perfumes.filter(id => id !== perfumeId) };
      }
      return c;
    });
    saveCollections(updated);
  };
  
  const getCollectionPerfumes = (collection) => {
    return allPerfumes.filter(p => collection.perfumes.includes(p.id));
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-2xl">
              <FolderHeart className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            My Collections
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Organize your favorite perfumes into custom collections
          </p>
        </div>
        
        {/* Collections List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <button
                onClick={() => setShowNewCollection(true)}
                className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
              >
                <Plus className="w-5 h-5" />
                <span>New Collection</span>
              </button>
              
              <div className="space-y-2">
                {collections.map(collection => (
                  <div
                    key={collection.id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      selectedCollection?.id === collection.id
                        ? 'bg-primary-100 dark:bg-primary-900'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{collection.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{collection.perfumes.length} perfumes</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCollection(collection.id);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {collections.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No collections yet.<br />Create your first one!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCollection ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {selectedCollection.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedCollection.perfumes.length} perfumes in this collection
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getCollectionPerfumes(selectedCollection).map(perfume => (
                    <div key={perfume.id} className="relative">
                      <PerfumeCard perfume={perfume} />
                      <button
                        onClick={() => removeFromCollection(selectedCollection.id, perfume.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {selectedCollection.perfumes.length === 0 && (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
                    <FolderHeart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">This collection is empty</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Go to any perfume and add it to this collection
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
                <FolderHeart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {collections.length === 0
                    ? 'Create your first collection to get started'
                    : 'Select a collection from the left to view its perfumes'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* New Collection Modal */}
        {showNewCollection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">New Collection</h3>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name (e.g., Summer Scents)"
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 mb-4 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && createCollection()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={createCollection}
                  className="flex-1 btn-primary"
                  disabled={!newCollectionName.trim()}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewCollection(false);
                    setNewCollectionName('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;

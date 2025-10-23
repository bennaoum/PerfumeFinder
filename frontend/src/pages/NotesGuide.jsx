import React, { useState, useEffect } from 'react';
import { perfumeApi } from '../services/api';
import { Book, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const noteDescriptions = {
  'Vanilla': 'Sweet, warm, and comforting. Adds a creamy, dessert-like quality to fragrances.',
  'Rose': 'Classic floral scent. Romantic, elegant, and timeless with a sweet, powdery quality.',
  'Jasmine': 'Rich, exotic floral. Intoxicating and sensual with a sweet, heady aroma.',
  'Sandalwood': 'Creamy, warm wood. Soft and smooth with a milky, slightly sweet character.',
  'Patchouli': 'Earthy, woody, and slightly sweet. Adds depth and a bohemian character.',
  'Bergamot': 'Bright citrus with subtle floral notes. Fresh, uplifting, and slightly bitter.',
  'Lavender': 'Clean, herbal, and calming. Fresh and aromatic with a slightly medicinal quality.',
  'Musk': 'Warm, skin-like, and sensual. Adds depth and longevity to fragrances.',
  'Amber': 'Warm, resinous, and slightly sweet. Rich and cozy with a powdery finish.',
  'Oud': 'Deep, woody, and complex. Smoky, animalic, and highly prized in perfumery.',
  'Cedar': 'Dry, woody, and pencil-like. Clean and sophisticated with a slightly bitter edge.',
  'Vetiver': 'Earthy, green, and woody. Slightly smoky with a fresh, grassy quality.',
  'Tonka Bean': 'Sweet, warm, and slightly spicy. Similar to vanilla but with almond notes.',
  'Oakmoss': 'Earthy, woody, and slightly sweet. Adds a forest-like, natural character.',
  'Citrus': 'Bright, fresh, and zesty. Uplifting and energizing top note.',
  'Pepper': 'Spicy, warm, and piquant. Adds a vibrant, energetic kick.',
  'Cinnamon': 'Warm, sweet, and spicy. Comforting with a subtle heat.',
  'Leather': 'Rich, smoky, and slightly animalic. Adds sophistication and edge.',
  'Tobacco': 'Warm, slightly sweet, and aromatic. Rich and comforting.',
  'Iris': 'Powdery, floral, and slightly earthy. Elegant and sophisticated.',
};

const NotesGuide = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadNotes();
  }, []);
  
  const loadNotes = async () => {
    try {
      const response = await perfumeApi.getNotes();
      setAllNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredNotes = allNotes.filter(note => {
    const matchesSearch = note.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || note.type === selectedType;
    return matchesSearch && matchesType;
  });
  
  const notesByType = {
    top: filteredNotes.filter(n => n.type === 'top'),
    middle: filteredNotes.filter(n => n.type === 'middle'),
    base: filteredNotes.filter(n => n.type === 'base'),
  };
  
  const NoteCard = ({ note }) => {
    const [showingPerfumes, setShowingPerfumes] = useState(false);
    const [perfumes, setPerfumes] = useState([]);
    
    const loadPerfumesWithNote = async () => {
      if (perfumes.length === 0) {
        try {
          const response = await perfumeApi.getRecommendationsByNotes([note.name], { limit: 6 });
          setPerfumes(response.data);
        } catch (error) {
          console.error('Error loading perfumes:', error);
        }
      }
      setShowingPerfumes(!showingPerfumes);
    };
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{note.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              note.type === 'top' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
              note.type === 'middle' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' :
              'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
            }`}>
              {note.type === 'top' ? 'Top' : note.type === 'middle' ? 'Heart' : 'Base'} Note
            </span>
          </div>
          <Sparkles className="w-6 h-6 text-primary-400" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {noteDescriptions[note.name] || 'A beautiful fragrance note used in perfumery.'}
        </p>
        
        <button
          onClick={loadPerfumesWithNote}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          {showingPerfumes ? 'Hide perfumes' : 'View perfumes with this note'} →
        </button>
        
        {showingPerfumes && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            {perfumes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {perfumes.slice(0, 4).map(perfume => (
                  <Link
                    key={perfume.id}
                    to={`/perfume/${perfume.id}`}
                    className="flex items-center space-x-2 p-2 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <img src={perfume.image_url} alt={perfume.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{perfume.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{perfume.brand}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-2xl">
              <Book className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Fragrance Notes Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn about {allNotes.length} different fragrance notes and discover perfumes that contain them
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'top', 'middle', 'base'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'top' ? 'Top' : type === 'middle' ? 'Heart' : 'Base'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading notes...</p>
          </div>
        )}
        
        {/* Notes Grid */}
        {!loading && (
          <>
            {selectedType === 'all' ? (
              <>
                {notesByType.top.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-yellow-400 mr-3"></span>
                      Top Notes ({notesByType.top.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notesByType.top.map(note => (
                        <NoteCard key={note.name} note={note} />
                      ))}
                    </div>
                  </div>
                )}
                
                {notesByType.middle.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-pink-400 mr-3"></span>
                      Heart Notes ({notesByType.middle.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notesByType.middle.map(note => (
                        <NoteCard key={note.name} note={note} />
                      ))}
                    </div>
                  </div>
                )}
                
                {notesByType.base.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-purple-400 mr-3"></span>
                      Base Notes ({notesByType.base.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notesByType.base.map(note => (
                        <NoteCard key={note.name} note={note} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard key={note.name} note={note} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesGuide;

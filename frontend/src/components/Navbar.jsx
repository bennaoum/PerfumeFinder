import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Heart, Home, Droplets, Moon, Sun, Menu, X, Book, GitCompare, FolderHeart, HelpCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) =>
    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800'
    }`;
  
  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <span className="font-display text-2xl font-bold text-primary-800 dark:text-primary-200">
              Perfume Finder
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/" className={navLinkClass('/')}>
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            <Link to="/find-by-notes" className={navLinkClass('/find-by-notes')}>
              <Droplets className="w-5 h-5" />
              <span>Find by Notes</span>
            </Link>
            
            <Link to="/quiz" className={navLinkClass('/quiz')}>
              <HelpCircle className="w-5 h-5" />
              <span>Quiz</span>
            </Link>
            
            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`${navLinkClass('')} ${moreMenuOpen ? 'bg-primary-100 dark:bg-primary-900' : ''}`}
              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setMoreMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50">
                    <Link
                      to="/compare"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <GitCompare className="w-4 h-4" />
                      <span>Compare</span>
                    </Link>
                    <Link
                      to="/notes-guide"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <Book className="w-4 h-4" />
                      <span>Notes Guide</span>
                    </Link>
                    <Link
                      to="/collections"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <FolderHeart className="w-4 h-4" />
                      <span>Collections</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            <Link to="/favorites" className={navLinkClass('/favorites')}>
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            <Link to="/" className={navLinkClass('/')} onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/find-by-notes" className={navLinkClass('/find-by-notes')} onClick={() => setMobileMenuOpen(false)}>
              <Droplets className="w-5 h-5" />
              <span>Find by Notes</span>
            </Link>
            <Link to="/quiz" className={navLinkClass('/quiz')} onClick={() => setMobileMenuOpen(false)}>
              <HelpCircle className="w-5 h-5" />
              <span>Perfume Quiz</span>
            </Link>
            <Link to="/compare" className={navLinkClass('/compare')} onClick={() => setMobileMenuOpen(false)}>
              <GitCompare className="w-5 h-5" />
              <span>Compare Perfumes</span>
            </Link>
            <Link to="/notes-guide" className={navLinkClass('/notes-guide')} onClick={() => setMobileMenuOpen(false)}>
              <Book className="w-5 h-5" />
              <span>Notes Guide</span>
            </Link>
            <Link to="/collections" className={navLinkClass('/collections')} onClick={() => setMobileMenuOpen(false)}>
              <FolderHeart className="w-5 h-5" />
              <span>Collections</span>
            </Link>
            <Link to="/favorites" className={navLinkClass('/favorites')} onClick={() => setMobileMenuOpen(false)}>
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

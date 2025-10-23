import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PerfumeDetail from './pages/PerfumeDetail';
import FindByNotes from './pages/FindByNotes';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import NotesGuide from './pages/NotesGuide';
import Collections from './pages/Collections';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfume/:id" element={<PerfumeDetail />} />
          <Route path="/find-by-notes" element={<FindByNotes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/notes-guide" element={<NotesGuide />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

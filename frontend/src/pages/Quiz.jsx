import React, { useState } from 'react';
import { perfumeApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import { HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What's your preferred scent character?",
    options: [
      { label: "Fresh & Clean", notes: ['Bergamot', 'Lavender', 'Citrus'], family: 'Fresh Aquatic' },
      { label: "Sweet & Warm", notes: ['Vanilla', 'Tonka Bean', 'Amber'], family: 'Oriental' },
      { label: "Woody & Earthy", notes: ['Sandalwood', 'Cedar', 'Vetiver'], family: 'Woody' },
      { label: "Floral & Romantic", notes: ['Rose', 'Jasmine', 'Iris'], family: 'Floral' },
    ],
  },
  {
    id: 2,
    question: "When do you plan to wear this perfume?",
    options: [
      { label: "Daily / Office", notes: ['Lavender', 'Bergamot', 'Musk'], occasion: 'office' },
      { label: "Evening / Date Night", notes: ['Oud', 'Rose', 'Vanilla'], occasion: 'evening' },
      { label: "Special Occasions", notes: ['Amber', 'Patchouli', 'Jasmine'], occasion: 'special' },
      { label: "Casual / Anytime", notes: ['Citrus', 'Cedar', 'Tonka Bean'], occasion: 'casual' },
    ],
  },
  {
    id: 3,
    question: "What season do you prefer?",
    options: [
      { label: "Spring / Summer", notes: ['Bergamot', 'Citrus', 'Jasmine'], gender: 'All' },
      { label: "Fall / Winter", notes: ['Vanilla', 'Amber', 'Oud'], gender: 'All' },
      { label: "All Year Round", notes: ['Musk', 'Cedar', 'Rose'], gender: 'All' },
    ],
  },
  {
    id: 4,
    question: "Your gender preference?",
    options: [
      { label: "For Men", gender: 'Men' },
      { label: "For Women", gender: 'Women' },
      { label: "Unisex", gender: 'Unisex' },
      { label: "No Preference", gender: 'All' },
    ],
  },
  {
    id: 5,
    question: "How bold do you want your scent?",
    options: [
      { label: "Subtle & Intimate", notes: ['Musk', 'Iris', 'Sandalwood'] },
      { label: "Moderate & Balanced", notes: ['Rose', 'Cedar', 'Bergamot'] },
      { label: "Strong & Bold", notes: ['Oud', 'Patchouli', 'Leather'] },
      { label: "Very Intense", notes: ['Tobacco', 'Amber', 'Vanilla'] },
    ],
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - calculate results
      await calculateResults(newAnswers);
    }
  };
  
  const calculateResults = async (allAnswers) => {
    setLoading(true);
    
    try {
      // Collect all notes from answers
      const allNotes = allAnswers
        .flatMap(a => a.notes || [])
        .filter((note, index, self) => self.indexOf(note) === index);
      
      // Get gender preference
      const genderAnswer = allAnswers.find(a => a.gender);
      const gender = genderAnswer?.gender !== 'All' ? genderAnswer?.gender : undefined;
      
      // Get family preference
      const familyAnswer = allAnswers.find(a => a.family);
      const family = familyAnswer?.family;
      
      // Get recommendations based on collected criteria
      const response = await perfumeApi.getRecommendationsByNotes(
        allNotes,
        {
          limit: 12,
          gender,
          family,
        }
      );
      
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating results:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  if (results) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl">
                <HelpCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Your Perfect Matches!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Based on your preferences, here are {results.length} perfumes we think you'll love
            </p>
            <button
              onClick={restartQuiz}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Quiz Again</span>
            </button>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  showSimilarity={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                No exact matches found for your preferences
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try taking the quiz again with different answers
              </p>
              <button onClick={restartQuiz} className="btn-primary">
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Finding your perfect perfumes...</p>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Perfume Finder Quiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Answer {questions.length} quick questions to find your perfect scent
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-6 text-left bg-gray-50 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 border-2 border-transparent hover:border-primary-400 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                    {option.label}
                  </span>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Back Button */}
        {currentQuestion > 0 && (
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            ← Back to previous question
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;

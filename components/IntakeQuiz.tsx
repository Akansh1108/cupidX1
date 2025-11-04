
import React, { useState } from 'react';
import { IntakeAnswer } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface IntakeQuizProps {
  questions: string[];
  onComplete: (answers: IntakeAnswer[]) => void;
}

const IntakeQuiz: React.FC<IntakeQuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswer[]>(
    questions.map(q => ({ question: q, answer: '' }))
  );

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex].answer = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  if (questions.length === 0) {
      return (
        <div className="w-full max-w-lg p-8 bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in-up text-center">
            <LoadingSpinner/>
            <p className="mt-4 text-white">Crafting your personal questions...</p>
        </div>
      );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentIndex]?.answer || '';

  return (
    <div className="w-full max-w-xl p-8 bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in-up flex flex-col">
      <div className="w-full mb-6">
        <div className="bg-gray-700 rounded-full h-2.5">
          <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">Question {currentIndex + 1} of {questions.length}</p>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">{questions[currentIndex]}</h3>
        <textarea
          value={currentAnswer}
          onChange={handleAnswerChange}
          placeholder="Take your time, be honest with yourself..."
          className="w-full h-48 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
        >
          {currentIndex === questions.length - 1 ? 'Generate Blueprint' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default IntakeQuiz;

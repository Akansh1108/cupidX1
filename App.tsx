
import React, { useState, useCallback } from 'react';
import { AppStage, ScreeningData, IntakeAnswer, FullBlueprint } from './types';
import { generateIntakeQuestions, generateBlueprintAndProfile, analyzeContext, generateVibeCheckQuestions } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen';
import ScreeningForm from './components/ScreeningForm';
import IntakeQuiz from './components/IntakeQuiz';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.Welcome);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [intakeQuestions, setIntakeQuestions] = useState<string[]>([]);
  const [intakeAnswers, setIntakeAnswers] = useState<IntakeAnswer[]>([]);
  const [fullBlueprint, setFullBlueprint] = useState<FullBlueprint | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStage(AppStage.Screening);
  };

  const handleScreeningSubmit = async (data: ScreeningData) => {
    setScreeningData(data);
    setStage(AppStage.Intake);
    setLoadingMessage('Crafting your personal questions...');
    try {
      const questions = await generateIntakeQuestions(data);
      setIntakeQuestions(questions);
      setIntakeAnswers(questions.map((q, i) => ({ question: q, answer: '' })));
    } catch (e) {
      console.error(e);
      setError('Sorry, I had trouble crafting your questions. Please try refreshing.');
    } finally {
      setLoadingMessage('');
    }
  };

  const handleIntakeComplete = async (answers: IntakeAnswer[]) => {
    setIntakeAnswers(answers);
    setStage(AppStage.Generating);
    setLoadingMessage('Mapping your Emotional Blueprint...');
    if (!screeningData) {
      setError('Something went wrong, screening data is missing.');
      setStage(AppStage.Screening);
      return;
    }
    try {
      const blueprint = await generateBlueprintAndProfile(screeningData, answers);
      setFullBlueprint(blueprint);
      setStage(AppStage.Results);
    } catch (e) {
      console.error(e);
      setError('I had trouble generating your blueprint. Please try again.');
      setStage(AppStage.Intake);
    } finally {
      setLoadingMessage('');
    }
  };
  
  const handleReset = () => {
    setStage(AppStage.Welcome);
    setScreeningData(null);
    setIntakeQuestions([]);
    setIntakeAnswers([]);
    setFullBlueprint(null);
    setError(null);
    setLoadingMessage('');
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-8 bg-white/10 rounded-lg shadow-2xl">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button onClick={handleReset} className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105">
            Start Over
          </button>
        </div>
      );
    }
    
    if (loadingMessage) {
        return <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-white text-xl mt-4 animate-pulse">{loadingMessage}</p>
        </div>
    }

    switch (stage) {
      case AppStage.Welcome:
        return <WelcomeScreen onStart={handleStart} />;
      case AppStage.Screening:
        return <ScreeningForm onSubmit={handleScreeningSubmit} />;
      case AppStage.Intake:
        return <IntakeQuiz questions={intakeQuestions} onComplete={handleIntakeComplete} />;
      case AppStage.Generating:
         return <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-white text-xl mt-4 animate-pulse">{loadingMessage}</p>
        </div>
      case AppStage.Results:
        return fullBlueprint && <ResultsDisplay blueprint={fullBlueprint} onReset={handleReset} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-4 selection:bg-pink-500/30">
      <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[95vh]">
        <Header />
        <main className="flex-grow flex items-center justify-center py-10">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;

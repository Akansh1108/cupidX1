
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg animate-fade-in-up">
      <div className="mb-6">
        <span className="text-5xl" role="img" aria-label="waving hand">👋</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hey, I'm CupidX</h2>
      <p className="text-lg text-gray-300 mb-8">
        I help you understand the science of your heart. Let's map your Emotional Blueprint and find out who truly matches your vibe.
      </p>
      <button
        onClick={onStart}
        className="w-full sm:w-auto px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
      >
        Let's Begin
      </button>
    </div>
  );
};

export default WelcomeScreen;

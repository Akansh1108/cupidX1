
import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ icon, title, children }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-pink-400">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="text-gray-300 space-y-2 leading-relaxed prose prose-invert prose-p:my-1 prose-ul:my-1">
        {children}
      </div>
    </div>
  );
};

export default Card;

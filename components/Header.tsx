
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4">
      <div className="flex items-center justify-center gap-2">
        <HeartIcon className="w-8 h-8 text-pink-400" />
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Cupid<span className="text-pink-400">X</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;

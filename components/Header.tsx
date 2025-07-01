
import React from 'react';
import { APP_NAME, APP_SLOGAN, LOGO_URL } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="hnai-teal-bg text-hnai-yellow shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center">
          <img src={LOGO_URL} alt="HERE AND NOW AI Logo" className="h-12 sm:h-16 mr-3"/>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{APP_NAME}</h1>
            <p className="text-xs sm:text-sm italic">{APP_SLOGAN}</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 text-sm">
          Powered by <span className="font-semibold">HERE AND NOW AI</span>
        </div>
      </div>
    </header>
  );
};

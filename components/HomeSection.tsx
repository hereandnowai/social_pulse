
import React from 'react';
import { APP_NAME } from '../constants';

interface HomeSectionProps {
  onNavigateToAnalysis: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigateToAnalysis }) => {
  return (
    <div className="text-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-hnai-teal mb-4">
        Welcome to <span className="text-hnai-yellow">{APP_NAME}</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-700 mb-8">
        Unlock real-time insights from social media. Analyze sentiment, track trends, and understand your audience like never before. Powered by HERE AND NOW AI.
      </p>
      <button
        onClick={onNavigateToAnalysis}
        aria-label="Start analyzing social media content"
        className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-hnai-dark-text hnai-yellow-bg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hnai-yellow shadow-lg transform transition-transform duration-150 hover:scale-105"
      >
        Start Analyzing Now
      </button>

      <div className="mt-12 sm:mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-hnai-teal mb-8">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center sm:text-left sm:items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-hnai-yellow text-hnai-dark-text">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-hnai-teal mt-4 mb-2">Real-time Sentiment</h3>
            <p className="text-sm text-gray-600">Instantly gauge public opinion (Positive, Negative, Neutral) with detailed scores.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center sm:text-left sm:items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-hnai-yellow text-hnai-dark-text">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-hnai-teal mt-4 mb-2">Emotion Tracking</h3>
            <p className="text-sm text-gray-600">Identify underlying emotions like joy, anger, and surprise in social conversations.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center sm:text-left sm:items-start">
             <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-hnai-yellow text-hnai-dark-text">
                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-hnai-teal mt-4 mb-2">Trend Analysis</h3>
            <p className="text-sm text-gray-600">Visualize sentiment shifts over time to understand campaign impact and market changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

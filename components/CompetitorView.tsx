
import React, { useState, useCallback } from 'react';
import { SentimentAnalysisResult, Sentiment } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Card } from './common/Card';

interface CompetitorViewProps {
  analyzeFunction: (texts: string[]) => Promise<SentimentAnalysisResult[]>;
}

const SentimentCard: React.FC<{ title: string; result: SentimentAnalysisResult | null; isLoading: boolean }> = ({ title, result, isLoading }) => {
  if (isLoading) return <div className="p-4 bg-gray-50 rounded-lg shadow h-48 flex items-center justify-center"><LoadingSpinner /></div>;
  if (!result) return <div className="p-4 bg-gray-50 rounded-lg shadow h-48 flex items-center justify-center text-gray-500">Enter text to analyze.</div>;
  
  if (result.sentiment === Sentiment.Error) {
    return (
      <div className="p-4 bg-orange-100 border border-orange-400 rounded-lg shadow min-h-[12rem] flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-hnai-teal mb-2">{title}</h3>
        <p className="text-2xl font-bold text-orange-500">Analysis Error</p>
        <p className="text-sm text-orange-700 mt-1">Could not analyze this text.</p>
         {result.keywords && result.keywords.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">Details: {result.keywords.join(", ")}</p>
          )}
      </div>
    );
  }


  const scorePercentage = (result.score * 100).toFixed(1);
  const sentimentColor = 
    result.sentiment === Sentiment.Positive ? 'text-positive' :
    result.sentiment === Sentiment.Negative ? 'text-negative' :
    'text-neutral';
  
  const sentimentBgColor = 
    result.sentiment === Sentiment.Positive ? 'bg-positive' :
    result.sentiment === Sentiment.Negative ? 'bg-negative' :
    'bg-neutral';

  return (
    <div className="p-4 bg-white rounded-lg shadow min-h-[12rem]">
      <h3 className="text-lg font-semibold text-hnai-teal mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${sentimentColor}`}>{result.sentiment}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 my-2">
        <div 
          className={`${sentimentBgColor} h-2 rounded-full`}
          style={{ width: `${scorePercentage}%` }}
           aria-valuenow={parseFloat(scorePercentage)}
           aria-valuemin={0}
           aria-valuemax={100}
           role="progressbar"
           aria-label={`Sentiment score: ${scorePercentage}%`}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{scorePercentage}% score</p>
      {result.emotions && result.emotions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Emotions: {result.emotions.join(', ')}</p>
        </div>
      )}
       {/* Optionally display keywords if available and relevant for non-error results too */}
       {result.keywords && result.keywords.length > 0 && (
         <div className="mt-2">
           <p className="text-xs text-gray-500">Keywords: {result.keywords.join(', ')}</p>
         </div>
       )}
    </div>
  );
};

export const CompetitorView: React.FC<CompetitorViewProps> = ({ analyzeFunction }) => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [resultA, setResultA] = useState<SentimentAnalysisResult | null>(null);
  const [resultB, setResultB] = useState<SentimentAnalysisResult | null>(null);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (text: string, setTextLoading: React.Dispatch<React.SetStateAction<boolean>>, setResult: React.Dispatch<React.SetStateAction<SentimentAnalysisResult | null>>) => {
    if (!text.trim()) {
      setResult(null); // Clear previous result if text is empty
      return;
    }
    setTextLoading(true);
    setError(null); // Clear general error for this specific new analysis
    try {
      const analysisResults = await analyzeFunction([text]); // Send text as a single-element array
      if (analysisResults && analysisResults.length > 0) {
        setResult(analysisResults[0]); // Use the first result from the array
      } else {
        // This case should ideally be handled by analyzeFunction returning an Error sentiment object
        console.error("No analysis result returned from the API for:", text);
        setResult({ 
          sentiment: Sentiment.Error,
          score: 0,
          emotions: [],
          keywords: ["No result from API"]
        });
      }
    } catch (err) {
      console.error("Competitor analysis error:", err);
      // Display specific error in the card, rather than a general error message for the whole view
      let detailMessage = "API or processing error";
      if (err instanceof Error && err.message) {
        detailMessage = err.message;
      }
      setResult({ 
        sentiment: Sentiment.Error,
        score: 0,
        emotions: [],
        keywords: [detailMessage.substring(0, 150)] // Show first 150 chars of actual error as detail
      });
    } finally {
      setTextLoading(false);
    }
  }, [analyzeFunction]);

  return (
    <Card title="Competitor Sentiment Comparison">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* This general error might be less useful now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="textA" className="block text-sm font-medium text-gray-700 mb-1">Brand/Text A</label>
          <textarea
            id="textA"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Enter text for Brand A..."
            aria-label="Text input for Brand A"
          />
          <button
            onClick={() => handleAnalyze(textA, setIsLoadingA, setResultA)}
            disabled={isLoadingA || !textA.trim()}
            className="mt-2 w-full px-4 py-2 bg-hnai-yellow text-hnai-dark-text font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoadingA ? 'Analyzing...' : 'Analyze Brand A'}
          </button>
          <div className="mt-4">
            <SentimentCard title="Brand A Results" result={resultA} isLoading={isLoadingA} />
          </div>
        </div>
        <div>
          <label htmlFor="textB" className="block text-sm font-medium text-gray-700 mb-1">Brand/Text B</label>
          <textarea
            id="textB"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Enter text for Brand B..."
            aria-label="Text input for Brand B"
          />
          <button
            onClick={() => handleAnalyze(textB, setIsLoadingB, setResultB)}
            disabled={isLoadingB || !textB.trim()}
            className="mt-2 w-full px-4 py-2 bg-hnai-yellow text-hnai-dark-text font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoadingB ? 'Analyzing...' : 'Analyze Brand B'}
          </button>
           <div className="mt-4">
            <SentimentCard title="Brand B Results" result={resultB} isLoading={isLoadingB} />
          </div>
        </div>
      </div>
    </Card>
  );
};

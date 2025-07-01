
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { TrendChart } from './components/TrendChart';
import { CompetitorView } from './components/CompetitorView';
import { ChatBot } from './components/ChatBot';
import { AlertsConfig } from './components/AlertsConfig';
import { HomeSection } from './components/HomeSection';
import { PostAnalysisSection } from './components/PostAnalysisSection'; // Corrected Path
import { SentimentAnalysisResult, Sentiment, ProcessedResponse } from './types';
import { analyzeTextSentiment, getChatbotResponse } from './services/geminiService';
import { MOCK_TREND_DATA } from './constants';
import { Card } from './components/common/Card';

const App: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<SentimentAnalysisResult[] | null>(null);
  const [analyzedTexts, setAnalyzedTexts] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home'); // Default to 'home'
  const [initialTextFromUrl, setInitialTextFromUrl] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (fullInputText: string) => {
    const textsToAnalyze = fullInputText.split('\n').map(t => t.trim()).filter(t => t !== '');
    
    if (textsToAnalyze.length === 0) {
      setError("Please enter some text to analyze, one comment per line.");
      setCurrentAnalysis(null);
      setAnalyzedTexts(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalyzedTexts(textsToAnalyze); // Store original texts
    try {
      const results = await analyzeTextSentiment(textsToAnalyze);
      setCurrentAnalysis(results);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze sentiment. Please ensure your API key is configured and try again.");
      setCurrentAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleNavigateToAnalysis = useCallback(() => {
    setActiveTab('analysis');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const textToAnalyze = params.get('textToAnalyze');
    if (textToAnalyze && textToAnalyze.trim() !== '') {
      const decodedText = decodeURIComponent(textToAnalyze);
      setInitialTextFromUrl(decodedText); // For InputSection to pick up
      setActiveTab('analysis');
      handleAnalyze(decodedText);
    }
  }, [handleAnalyze]); // handleAnalyze is memoized, safe to include

  const TABS = [
    { id: 'home', label: 'Home' },
    { id: 'analysis', label: 'Batch Analysis' },
    { id: 'post-analysis', label: 'Post URL Analysis' }, 
    { id: 'trends', label: 'Trends' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'alerts', label: 'Alerts' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection onNavigateToAnalysis={() => setActiveTab('analysis')} />;
      case 'analysis':
        return (
          <>
            <InputSection 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading} 
              initialTextFromUrl={initialTextFromUrl} 
            />
            {error && <p className="text-red-500 text-center my-4">{error}</p>}
            {currentAnalysis && analyzedTexts && !isLoading && (
              <ResultsSection results={currentAnalysis} originalTexts={analyzedTexts} />
            )}
          </>
        );
      case 'post-analysis':
        return <PostAnalysisSection analyzeFunction={analyzeTextSentiment} />;
      case 'trends':
        return (
          <Card title="Sentiment Trends (Mock Data)">
            <TrendChart data={MOCK_TREND_DATA} />
          </Card>
        );
      case 'competitors':
        return <CompetitorView analyzeFunction={analyzeTextSentiment} />;
      case 'alerts':
        return <AlertsConfig />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-hnai-dark-text">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center space-x-1 sm:space-x-2 border-b-2 border-hnai-teal pb-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out
                ${activeTab === tab.id 
                  ? 'bg-hnai-teal text-hnai-yellow' 
                  : 'text-hnai-teal hover:bg-hnai-teal/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {(isLoading && (activeTab === 'analysis' || activeTab === 'post-analysis')) && (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-hnai-teal"></div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
           {/* Logic to hide content area while loading for relevant tabs */}
           {!(isLoading && (activeTab === 'analysis' || activeTab === 'post-analysis') && currentAnalysis === null && activeTab !== 'post-analysis' /* Keep post-analysis structure visible */) || (activeTab !== 'analysis' && activeTab !== 'post-analysis')
            ? renderActiveTab() 
            : null}
        </div>
      </main>
      <ChatBot getResponse={getChatbotResponse} />
      <Footer />
    </div>
  );
};

export default App;

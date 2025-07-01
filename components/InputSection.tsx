
import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { SocialPlatform, PLATFORM_DISPLAY_NAMES } from '../types'; // Removed unused platform-specific types
import { LoadingSpinner } from './common/LoadingSpinner'; 

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  initialTextFromUrl?: string | null;
}

// This function becomes largely irrelevant for the Batch Analysis tab now but kept for structural integrity
// or potential future re-use if a "Fetch from URL (General)" button is added.
const generateMockPlatformData = (platform: SocialPlatform, term: string): string => {
  const t = term || "ExampleTopic";
  // Simplified as only GeneralText will be practically selectable in this context
  return `This is some general example text about ${t}.\nIt demonstrates how content might appear for analysis.`;
};

const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};


export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading, initialTextFromUrl }) => {
  const [manualText, setManualText] = useState<string>('');
  // selectedPlatform will always be GeneralText now in this component's context
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(SocialPlatform.GeneralText); 
  
  // searchTerm and platform-specific states are no longer directly used by interactive UI in this simplified version
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  const [isPlatformFetching, setIsPlatformFetching] = useState<boolean>(false);
  const [platformFetchStatus, setPlatformFetchStatus] = useState<{ type: 'info' | 'error' | 'success', message: string } | null>(null);


  useEffect(() => {
    if (initialTextFromUrl) {
      setManualText(initialTextFromUrl);
      setSelectedPlatform(SocialPlatform.GeneralText); // Ensure it's GeneralText
    }
  }, [initialTextFromUrl]);

  const handleSubmitManualText = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(manualText);
  };

  // This handler is now effectively only for 'GeneralText' if a button were to call it.
  // The existing button that called this is removed because selectedPlatform !== SocialPlatform.GeneralText will be false.
  const handlePlatformDataFetchAttempt = async () => {
    setIsPlatformFetching(true);
    setPlatformFetchStatus(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isUrl(searchTerm)) {
        setPlatformFetchStatus({ type: 'info', message: `Attempting to fetch content from ${searchTerm}... (Note: This may be blocked by browser security for many sites.)` });
        try {
            const response = await fetch(searchTerm);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            let extractedText = '';
            const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.querySelector('.content') || doc.body;
             if (mainContent) {
                const paragraphs = mainContent.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    extractedText = Array.from(paragraphs).map(p => p.textContent || '').join('\n\n');
                } else {
                    extractedText = mainContent.textContent || '';
                }
            }
            const cleanedText = extractedText.replace(/\s\s+/g, ' ').trim();
            if (cleanedText) {
                setManualText(cleanedText);
                setPlatformFetchStatus({ type: 'success', message: "Basic text content extracted. Review below." });
            } else {
                setPlatformFetchStatus({ type: 'info', message: "No meaningful text extracted. Paste manually." });
            }
        } catch (error) {
            setPlatformFetchStatus({ type: 'error', message: "Failed to fetch from URL (CORS or network issue). Paste manually." });
        }
    } else {
         setPlatformFetchStatus({ type: 'info', message: `For General Text, please paste content into the 'Manual Text Input' area or provide a URL to attempt fetching (feature currently not exposed via a button).`});
    }
    setIsPlatformFetching(false);
  };

  // This function will not render anything as selectedPlatform will be GeneralText
  const renderPlatformSpecificInputs = () => {
    return null;
  };

  return (
    <Card title="Manual Batch Sentiment Analysis">
      <div className="space-y-4">
        <div>
          <label htmlFor="dataSourceSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Data Input Method
          </label>
          <select
            id="dataSourceSelect"
            name="dataSourceSelect"
            value={selectedPlatform} // Will always be SocialPlatform.GeneralText
            // onChange is effectively disabled as there are no other options
            onChange={(e) => {
              setSelectedPlatform(e.target.value as SocialPlatform);
              setSearchTerm(''); 
              setPlatformFetchStatus(null);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-hnai-teal focus:border-hnai-teal sm:text-sm rounded-md shadow-sm"
          >
            {/* Only General Text option */}
            <option value={SocialPlatform.GeneralText}>{PLATFORM_DISPLAY_NAMES[SocialPlatform.GeneralText]}</option>
          </select>
        </div>
        
        {/* This will render null */}
        {renderPlatformSpecificInputs()}

        {/* This block will not render as selectedPlatform will be GeneralText */}
        {selectedPlatform !== SocialPlatform.GeneralText && (
           <div className="space-y-3 mt-3">
             <div>
                <label htmlFor="timeRange" className="block text-xs font-medium text-gray-700">Time Range (Conceptual)</label>
                <select 
                    id="timeRange" 
                    // value={timeRange} 
                    // onChange={e => setTimeRange(e.target.value as TimeRange)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-hnai-teal focus:border-hnai-teal rounded-md shadow-sm"
                >
                    {/* Options removed as this section won't render */}
                </select>
             </div>
            <button
              type="button"
              onClick={handlePlatformDataFetchAttempt}
              disabled={isPlatformFetching || !searchTerm.trim()}
              className="w-full px-4 py-2 text-sm font-medium rounded-md text-hnai-dark-text bg-hnai-yellow/80 hover:bg-hnai-yellow focus:outline-none flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPlatformFetching && <LoadingSpinner size="h-4 w-4 mr-2" />}
              {isPlatformFetching ? 'Fetching/Simulating...' : `Fetch/Simulate Data from ${PLATFORM_DISPLAY_NAMES[selectedPlatform]}`}
            </button>
            {platformFetchStatus && (
                <div className={`mt-2 p-3 text-xs rounded-md shadow-sm ${
                    platformFetchStatus.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                    platformFetchStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                    {platformFetchStatus.message}
                </div>
            )}
           </div>
        )}
        
        {/* Conditionally render hr only if the above block was supposed to render (which it won't) */}
        {/* <hr className="my-6 border-gray-300" /> */}

        <form onSubmit={handleSubmitManualText} className="space-y-4 pt-4"> {/* Added pt-4 for spacing */}
          <div>
            <label htmlFor="manualTextContent" className="block text-sm font-medium text-gray-700 mb-1">
             Manual Text Input
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Enter text directly for analysis. For multiple comments, enter each on a new line. 
              Sentiment analysis is performed on the content of this text area.
            </p>
            <textarea
              id="manualTextContent"
              name="manualTextContent"
              rows={8}
              className="mt-1 block w-full p-2.5 text-base border-gray-300 focus:outline-none focus:ring-hnai-teal focus:border-hnai-teal sm:text-sm rounded-md shadow-sm bg-gradient-to-b from-gray-50 to-gray-100"
              placeholder="Paste social media content here for analysis..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              required
              aria-multiline="true"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !manualText.trim()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-hnai-dark-text hnai-yellow-bg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hnai-yellow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-hnai-dark-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Pasted Text'
              )}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

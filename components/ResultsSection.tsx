
import React from 'react';
import { jsPDF } from 'jspdf';
import { SentimentAnalysisResult, Sentiment, SUPPORTED_LANGUAGES } from '../types';
import { EMOTION_COLORS } from '../constants';
import { Card } from './common/Card';

interface ResultsSectionProps {
  results: SentimentAnalysisResult[];
  originalTexts: string[];
}

const getSentimentColor = (sentiment: Sentiment): string => {
  switch (sentiment) {
    case Sentiment.Positive: return 'text-positive';
    case Sentiment.Negative: return 'text-negative';
    case Sentiment.Neutral: return 'text-neutral';
    case Sentiment.Error: return 'text-orange-500'; // Color for Error sentiment
    default: return 'text-gray-700';
  }
};

const getSentimentBgColor = (sentiment: Sentiment): string => {
  switch (sentiment) {
    case Sentiment.Positive: return 'bg-positive';
    case Sentiment.Negative: return 'bg-negative';
    case Sentiment.Neutral: return 'bg-neutral';
    case Sentiment.Error: return 'bg-orange-500'; // BG Color for Error sentiment
    default: return 'bg-gray-500';
  }
};

// SVG Icons for Sentiments
const PositiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`h-7 w-7 inline-block mr-2 ${className}`}>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
  </svg>
);

const NegativeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`h-7 w-7 inline-block mr-2 ${className}`}>
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41-.17-.79-.44-1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
  </svg>
);

const NeutralIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`h-7 w-7 inline-block mr-2 ${className}`}>
    <path d="M9 14h6v1.5H9z"></path><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
  </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`h-7 w-7 inline-block mr-2 ${className}`}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
  </svg>
);


const SingleResultDisplay: React.FC<{ result: SentimentAnalysisResult, originalText: string, index: number, isGrouped: boolean }> = ({ result, originalText, index, isGrouped }) => {
  const scorePercentage = (result.score * 100).toFixed(1);
  const sentimentColorClass = getSentimentColor(result.sentiment);
  // Language display is handled by the group header if `isGrouped` is true, otherwise shown per item
  const detectedLangDisplay = !isGrouped && result.detectedLanguage ? (SUPPORTED_LANGUAGES[result.detectedLanguage] || result.detectedLanguage) : null;


  const renderSentimentIcon = () => {
    switch (result.sentiment) {
      case Sentiment.Positive: return <PositiveIcon className={sentimentColorClass} />;
      case Sentiment.Negative: return <NegativeIcon className={sentimentColorClass} />;
      case Sentiment.Neutral: return <NeutralIcon className={sentimentColorClass} />;
      case Sentiment.Error: return <ErrorIcon className={sentimentColorClass} />;
      default: return null;
    }
  };

  return (
    <Card title={isGrouped ? `Comment ${index + 1} Analysis` : `Result for Comment ${index + 1}`} className="mb-6">
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Original Text:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{originalText}</p>
            </div>
            {detectedLangDisplay && ( // Only show if not grouped or no language info in group
                 <span className="text-xs bg-hnai-teal text-white px-2 py-1 rounded-full shadow-sm ml-2 whitespace-nowrap">
                    Lang: {detectedLangDisplay}
                 </span>
            )}
        </div>
      </div>
      {result.sentiment === Sentiment.Error ? (
        <div className="p-4 bg-orange-100 border border-orange-400 rounded-lg text-center">
          <p className={`text-2xl font-bold ${sentimentColorClass} flex items-center justify-center`}>
            {renderSentimentIcon()}
            Analysis Error
          </p>
          <p className="text-sm text-orange-700 mt-1">Could not analyze this comment.</p>
          {result.keywords && result.keywords.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">Details: {result.keywords.join(", ")}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Score */}
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <h4 className="text-md font-semibold text-hnai-teal mb-2">Overall Sentiment</h4>
            <div className={`text-3xl font-bold ${sentimentColorClass} flex items-center`}>
              {renderSentimentIcon()}
              {result.sentiment}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className={`${getSentimentBgColor(result.sentiment)} h-2.5 rounded-full`} 
                style={{ width: `${scorePercentage}%` }}
                aria-valuenow={parseFloat(scorePercentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label={`Sentiment score: ${scorePercentage}%`}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-600 mt-1">{scorePercentage}% confidence</p>
          </div>

          {/* Emotion Tags */}
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <h4 className="text-md font-semibold text-hnai-teal mb-3">Emotion Tags</h4>
            {result.emotions && result.emotions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.emotions.map((emotion, eIndex) => (
                  <span
                    key={eIndex}
                    className={`px-2 py-1 text-xs font-medium text-white rounded-full ${EMOTION_COLORS[emotion.toLowerCase()] || EMOTION_COLORS.default}`}
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No specific emotions detected.</p>
            )}
          </div>
        </div>
      )}

      {/* Keywords (Word Cloud Placeholder) */}
      {result.sentiment !== Sentiment.Error && result.keywords && result.keywords.length > 0 && (
         <div className="mt-4 p-4 bg-white rounded-lg shadow-inner">
            <h4 className="text-md font-semibold text-hnai-teal mb-3">Key Terms</h4>
            <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, kIndex) => (
                <span
                    key={kIndex}
                    className="px-2 py-1 text-xs bg-hnai-yellow text-hnai-dark-text rounded-full shadow-sm"
                >
                    {keyword}
                </span>
                ))}
            </div>
         </div>
      )}
    </Card>
  );
};

// Helper function to escape CSV fields
const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) {
    return '';
  }
  let str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};


export const ResultsSection: React.FC<ResultsSectionProps> = ({ results, originalTexts }) => {

  const handleExportCSV = () => {
    if (!results || results.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Comment Number", "Original Text", "Detected Language", "Sentiment", "Score", "Emotions", "Keywords"];
    const csvRows = [headers.join(',')];

    results.forEach((result, index) => {
      const originalText = originalTexts[index] || "N/A";
      const detectedLangDisplay = result.detectedLanguage ? SUPPORTED_LANGUAGES[result.detectedLanguage] || result.detectedLanguage : "N/A";
      const row = [
        index + 1,
        originalText,
        detectedLangDisplay,
        result.sentiment,
        result.score.toFixed(2),
        result.emotions.join('; '),
        result.keywords ? result.keywords.join('; ') : '',
      ].map(escapeCsvField);
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'social_pulse_analysis.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("CSV export is not supported in this browser.");
    }
  };

  const handleExportPDF = () => {
    if (!results || results.length === 0) {
      alert("No data to export.");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const lineHeight = 7;
      let currentY = margin;

      const addText = (text: string | string[], x: number, y: number, options?: any) => {
        if (currentY > pageHeight - margin - lineHeight) { // Check for page overflow before adding text
          doc.addPage();
          currentY = margin;
        }
        doc.text(text, x, currentY, options);
        if (Array.isArray(text)) {
            currentY += text.length * lineHeight;
        } else {
            currentY += lineHeight;
        }
      };
      
      const addWrappedText = (text: string, x: number, maxWidth: number, isBold: boolean = false) => {
        if (isBold) doc.setFont(undefined, 'bold');
        const splitText = doc.splitTextToSize(text, maxWidth);
        addText(splitText, x, currentY); // currentY is updated by addText
        if (isBold) doc.setFont(undefined, 'normal');
      };


      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      addText('Social Pulse - Analysis Report', pageWidth / 2, currentY, { align: 'center' });
      doc.setFont(undefined, 'normal');
      currentY += lineHeight * 2; // Extra space after title

      results.forEach((result, index) => {
        if (currentY > pageHeight - margin - (lineHeight * 9)) { // Estimate space needed for next entry (added 1 for language)
            doc.addPage();
            currentY = margin;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        addText(`Comment ${index + 1}:`, margin, currentY);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        currentY += lineHeight / 2; // Small gap

        addWrappedText(`Original Text: ${originalTexts[index] || "N/A"}`, margin, pageWidth - (margin * 2));
        currentY += lineHeight / 2;
        
        const detectedLangDisplay = result.detectedLanguage ? SUPPORTED_LANGUAGES[result.detectedLanguage] || result.detectedLanguage : "N/A";
        addText(`Detected Language: ${detectedLangDisplay}`, margin, currentY);
        addText(`Sentiment: ${result.sentiment}`, margin, currentY);
        addText(`Score: ${(result.score * 100).toFixed(1)}%`, margin, currentY);
        addText(`Emotions: ${result.emotions.length > 0 ? result.emotions.join(', ') : 'N/A'}`, margin, currentY);
        addText(`Keywords: ${result.keywords && result.keywords.length > 0 ? result.keywords.join(', ') : 'N/A'}`, margin, currentY);
        
        currentY += lineHeight * 1.5; // Extra space before next comment
        if (index < results.length -1) {
             if (currentY > pageHeight - margin - lineHeight) {
                doc.addPage();
                currentY = margin;
            }
            doc.setDrawColor(200, 200, 200); // Light gray line
            doc.line(margin, currentY - lineHeight * 0.75, pageWidth - margin, currentY - lineHeight * 0.75);
        }
      });

      doc.save('social_pulse_analysis.pdf');
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    }
  };
  
  const groupedResults: { [key: string]: { result: SentimentAnalysisResult; originalText: string }[] } = {};
  results.forEach((result, index) => {
    const langKey = result.detectedLanguage || 'unknown';
    if (!groupedResults[langKey]) {
      groupedResults[langKey] = [];
    }
    groupedResults[langKey].push({ result, originalText: originalTexts[index] || "N/A" });
  });

  // Define the order of languages
  const languageOrder = ['en', 'fr', 'de', 'es', 'hi', 'unknown'];
  const sortedLanguageKeys = Object.keys(groupedResults).sort((a, b) => {
    const indexA = languageOrder.indexOf(a);
    const indexB = languageOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Sort other unknown languages alphabetically
    if (indexA === -1) return 1; // Put 'a' (not in order) after 'b'
    if (indexB === -1) return -1; // Put 'b' (not in order) after 'a'
    return indexA - indexB; // Sort based on predefined order
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-hnai-teal mb-2 text-center">
        Batch Analysis Results
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Showing results for {results.length} comment(s), grouped by detected language.
      </p>
      
      {sortedLanguageKeys.map(langKey => (
        <div key={langKey} className="mb-8">
          <h3 className="text-xl font-semibold text-hnai-dark-text mb-4 p-2 bg-hnai-yellow/30 rounded-md shadow-sm">
            {SUPPORTED_LANGUAGES[langKey] || langKey} Comments ({groupedResults[langKey].length})
          </h3>
          {groupedResults[langKey].map(({ result, originalText }, index) => (
            <SingleResultDisplay 
              key={`${langKey}-${index}`} 
              result={result} 
              originalText={originalText} 
              index={index} // Index within the group for "Comment X analysis"
              isGrouped={true}
            />
          ))}
        </div>
      ))}

      {results.length === 0 && (
        <p className="text-center text-gray-500">No results to display. Please analyze some text.</p>
      )}

      {results.length > 0 && (
        <div className="mt-8 text-center space-x-2">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 text-sm bg-hnai-teal text-white rounded-md hover:bg-opacity-90 shadow-sm"
          >
            Export All as CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 text-sm bg-hnai-teal text-white rounded-md hover:bg-opacity-90 shadow-sm"
          >
            Export All as PDF
          </button>
        </div>
      )}
    </div>
  );
};
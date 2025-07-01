
import React, { useState, useCallback } from 'react';
import { SentimentAnalysisResult, Sentiment, SocialPlatform, PLATFORM_DISPLAY_NAMES, SUPPORTED_LANGUAGES } from '../types';
import { Card } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { EMOTION_COLORS } from '../constants';

interface PostAnalysisSectionProps {
  analyzeFunction: (texts: string[]) => Promise<SentimentAnalysisResult[]>;
}

// Correctly defined helper functions
const getSentimentColorText = (sentiment: Sentiment): string => {
  switch (sentiment) {
    case Sentiment.Positive: return 'text-positive';
    case Sentiment.Negative: return 'text-negative';
    case Sentiment.Neutral: return 'text-neutral';
    case Sentiment.Error: return 'text-orange-500';
    default: return 'text-gray-700';
  }
};

const getSentimentBgColor = (sentiment: Sentiment): string => {
  switch (sentiment) {
    case Sentiment.Positive: return 'bg-positive';
    case Sentiment.Negative: return 'bg-negative';
    case Sentiment.Neutral: return 'bg-neutral';
    case Sentiment.Error: return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

const PIE_CHART_COLORS: { [key in Sentiment]?: string } = {
  [Sentiment.Positive]: '#22C55E', // Green
  [Sentiment.Negative]: '#EF4444', // Red
  [Sentiment.Neutral]: '#6B7280', // Gray
  [Sentiment.Error]: '#F97316', // Orange
};

const generateMockCommentsForPlatform = (platform: SocialPlatform, url: string): string[] => {
  const topicMatch = url.match(/status\/(\d+)|v=([a-zA-Z0-9_-]+)|p\/([a-zA-Z0-9_-]+)|post\/([a-zA-Z0-9_-]+)/);
  const topic = topicMatch ? `post ${topicMatch[1] || topicMatch[2] || topicMatch[3] || topicMatch[4]}` : "this content";
  
  const comments = {
    [SocialPlatform.Twitter]: [
      `Just saw ${topic}! Absolutely mind-blowing! #Amazing`,
      `I'm not sure I agree with ${topic}. Seems a bit off. What do you think?`,
      `This is hilarious! 😂 Great take on ${topic}.`,
      `El análisis de ${topic} es muy profundo. ¡Excelente! (Spanish)`,
      `Ich finde ${topic} sehr interessant, aber ich habe ein paar Fragen. (German)`,
      `यह ${topic} बहुत जानकारीपूर्ण है। (Hindi)`
    ],
    [SocialPlatform.Instagram]: [
      `Wow, ${topic} looks incredible! 😍`,
      `Not a fan of ${topic}. The quality isn't there. 👎`,
      `J'adore ${topic}! C'est magnifique! (French)`,
      `This is exactly what I needed to see today regarding ${topic}. Thanks for sharing!`,
      `Das ist eine sehr coole Perspektive auf ${topic}. (German)`,
      `क्या ${topic} अद्भुत है! (Hindi)`
    ],
    [SocialPlatform.LinkedIn]: [
      `Insightful analysis of ${topic}. This has significant implications for our industry.`,
      `I have some reservations about the conclusions drawn from ${topic}. We need more data.`,
      `Great discussion on ${topic}! Relevant for all professionals.`,
      `Cet article sur ${topic} est très pertinent pour le marché français. (French)`,
      `Interesante punto de vista sobre ${topic}. (Spanish)`,
      `${topic} पर यह चर्चा महत्वपूर्ण है। (Hindi)`
    ],
    [SocialPlatform.YouTube]: [
      `Awesome video about ${topic}! Learned so much.`,
      `This video on ${topic} is terrible. Total waste of time.`,
      `Best explanation of ${topic} I've seen so far! 👍`,
      `Ce commentaire sur ${topic} est vraiment utile, merci! (French)`,
      `Was ${topic} angeht, bin ich anderer Meinung. (German)`,
      `${topic} के बारे में यह वीडियो बहुत अच्छा है। (Hindi)`
    ],
    [SocialPlatform.GeneralText]: [`General comment about ${topic}.`, `Another general thought regarding ${topic}.`, `सामान्य टिप्पणी ${topic} के बारे में। (Hindi)`]
  };
  return comments[platform] || comments[SocialPlatform.GeneralText];
};

export const PostAnalysisSection: React.FC<PostAnalysisSectionProps> = ({ analyzeFunction }) => {
  const [postUrl, setPostUrl] = useState<string>('');
  const [detectedPlatform, setDetectedPlatform] = useState<SocialPlatform | null>(null);
  const [analysisResults, setAnalysisResults] = useState<SentimentAnalysisResult[] | null>(null);
  const [originalComments, setOriginalComments] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const detectPlatformFromUrl = (url: string): SocialPlatform | null => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      if (domain.includes('twitter.com') || domain.includes('x.com')) return SocialPlatform.Twitter;
      if (domain.includes('instagram.com')) return SocialPlatform.Instagram;
      if (domain.includes('linkedin.com')) return SocialPlatform.LinkedIn;
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) return SocialPlatform.YouTube;
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleAnalyzePost = useCallback(async () => {
    if (!postUrl.trim()) {
      setError("Please enter a URL.");
      setAnalysisResults(null);
      setOriginalComments(null);
      setDetectedPlatform(null);
      setStatusMessage(null);
      return;
    }

    const platform = detectPlatformFromUrl(postUrl);
    setDetectedPlatform(platform);

    if (!platform) {
      setError("Could not detect a supported platform from the URL or URL is invalid. Please use a Twitter/X, Instagram, LinkedIn, or YouTube URL.");
      setAnalysisResults(null);
      setOriginalComments(null);
      setStatusMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);
    setOriginalComments(null);
    setStatusMessage(`Simulating comment fetching for ${PLATFORM_DISPLAY_NAMES[platform]}...`);

    // Simulate delay for mock fetching
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockComments = generateMockCommentsForPlatform(platform, postUrl);
    setOriginalComments(mockComments);
    setStatusMessage(`Found ${mockComments.length} mock comments. Analyzing sentiment...`);

    try {
      const results = await analyzeFunction(mockComments);
      setAnalysisResults(results);
      setStatusMessage(`Analysis complete for ${mockComments.length} mock comments.`);
    } catch (err) {
      console.error("Post analysis error:", err);
      setError("Failed to analyze sentiment for the mock comments. Please try again.");
      setAnalysisResults(null);
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, [postUrl, analyzeFunction]);

  const getOverallSentiment = (): { sentiment: Sentiment, score: number } => {
    if (!analysisResults || analysisResults.length === 0) {
      return { sentiment: Sentiment.None, score: 0 };
    }
    let totalScore = 0;
    let validAnalyses = 0;
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0, Error: 0, None: 0};

    analysisResults.forEach(res => {
      if (res.sentiment !== Sentiment.Error) {
        // Weighted score (e.g., positive as +score, negative as -score)
        totalScore += (res.sentiment === Sentiment.Positive ? res.score : res.sentiment === Sentiment.Negative ? -res.score : 0);
        validAnalyses++;
      }
      sentimentCounts[res.sentiment]++;
    });
    
    if (validAnalyses === 0) return { sentiment: Sentiment.Error, score: 0 };

    const averageWeightedScore = totalScore / validAnalyses;
    let overallSentiment: Sentiment;
    if (averageWeightedScore > 0.1) overallSentiment = Sentiment.Positive;
    else if (averageWeightedScore < -0.1) overallSentiment = Sentiment.Negative;
    else overallSentiment = Sentiment.Neutral;
    
    return { sentiment: overallSentiment, score: Math.abs(averageWeightedScore) };
  };

  const overallPostSentiment = getOverallSentiment();

  const getPieChartData = () => {
    if (!analysisResults) return [];
    const counts: { [key in Sentiment]?: number } = {};
    analysisResults.forEach(result => {
      counts[result.sentiment] = (counts[result.sentiment] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([name]) => name !== Sentiment.None)
      .map(([name, value]) => ({ name: name as Sentiment, value }));
  };
  
  const pieData = getPieChartData();
  
  const detectedLanguagesSummary = analysisResults 
    ? [...new Set(analysisResults.map(r => r.detectedLanguage).filter(Boolean))]
        .map(langCode => SUPPORTED_LANGUAGES[langCode!] || langCode)
        .join(', ')
    : "";


  return (
    <Card title="Analyze Public Social Media Post URL (Simulated Data)">
      <p className="text-sm text-gray-600 mb-4">
        Enter a public post URL from Twitter/X, Instagram, LinkedIn, or YouTube.
        The app will simulate fetching comments and analyze their sentiment using the Gemini API.
        <strong className="block mt-1">Note: Comment data is illustrative and not fetched live from the URL.</strong>
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="url"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="e.g., https://twitter.com/user/status/123..."
          className="flex-grow p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100"
          aria-label="Social media post URL"
        />
        <button
          onClick={handleAnalyzePost}
          disabled={isLoading}
          className="px-6 py-2.5 bg-hnai-yellow text-hnai-dark-text font-medium rounded-md hover:bg-opacity-90 shadow-sm disabled:opacity-60"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Post URL'}
        </button>
      </div>

      {isLoading && !statusMessage && <div className="text-center my-4"><LoadingSpinner /></div>}
      {statusMessage && <p className="text-sm text-blue-600 my-3 text-center">{statusMessage}</p>}
      {error && <p className="text-red-500 text-center my-3">{error}</p>}

      {detectedPlatform && !isLoading && !error && analysisResults && (
        <div className="mt-6 space-y-6">
          <Card title={`Analysis Summary for ${PLATFORM_DISPLAY_NAMES[detectedPlatform]} Post (Simulated)`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-lg font-semibold text-hnai-teal mb-1">Overall Post Sentiment (from mock comments)</h4>
                <p className={`text-2xl font-bold ${getSentimentColorText(overallPostSentiment.sentiment)}`}>
                  {overallPostSentiment.sentiment}
                  {overallPostSentiment.sentiment !== Sentiment.None && overallPostSentiment.sentiment !== Sentiment.Error && 
                    <span className="text-base font-normal ml-2">({(overallPostSentiment.score * 100).toFixed(1)}% score)</span>
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">Based on {analysisResults.length} simulated comments.</p>
                {detectedLanguagesSummary && (
                  <p className="text-xs text-gray-500 mt-1">Languages in mock comments: {detectedLanguagesSummary}.</p>
                )}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[entry.name] || '#808080'} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          
          <Card title="Simulated Comments & Analysis">
            {analysisResults.map((result, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50 shadow-sm">
                <p className="text-xs text-gray-500 mb-1 italic">Simulated Comment {index + 1}:</p>
                <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{originalComments?.[index] || "N/A"}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className={`${getSentimentColorText(result.sentiment)} font-semibold`}>
                    {result.sentiment} ({(result.score * 100).toFixed(0)}%)
                  </span>
                  {result.detectedLanguage && (
                    <span className="text-xs bg-hnai-teal text-white px-2 py-0.5 rounded-full shadow-sm">
                        Lang: {SUPPORTED_LANGUAGES[result.detectedLanguage] || result.detectedLanguage}
                    </span>
                  )}
                </div>
                {result.emotions && result.emotions.length > 0 && (
                  <div className="mt-1">
                    {result.emotions.map(emotion => (
                      <span key={emotion} className={`mr-1 px-1.5 py-0.5 text-xs font-medium text-white rounded-full ${EMOTION_COLORS[emotion.toLowerCase()] || EMOTION_COLORS.default}`}>
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}
                 {result.keywords && result.keywords.length > 0 && (
                   <p className="text-xs text-gray-500 mt-1">Keywords: {result.keywords.join(', ')}</p>
                 )}
              </div>
            ))}
          </Card>
        </div>
      )}
    </Card>
  );
};
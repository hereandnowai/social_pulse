
export enum Sentiment {
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral",
  Error = "Error", // Added for per-item errors in batch
  None = "None"
}

export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  score: number; // 0.0 to 1.0
  emotions: string[]; // e.g., ["joy", "anticipation"]
  keywords?: string[]; // Optional keywords for word cloud
  detectedLanguage?: string; // e.g., 'en', 'fr', 'de', 'es', 'hi', 'unknown'
}

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
  hi: "Hindi",
  unknown: "Unknown",
};

export interface SocialPost {
  id: string;
  platform: string;
  content: string;
  timestamp: string; // ISO date string
  author?: string;
  sentiment?: SentimentAnalysisResult;
}

export interface TrendDataPoint {
  date: string; // e.g., "Jan", "Feb", "Week 1"
  positive: number;
  negative: number;
  neutral: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  avatar?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface ProcessedResponse {
  text: string;
  sources?: GroundingChunk[];
}

// New types for social media platform integration UI
export enum SocialPlatform {
  GeneralText = "general",
  Twitter = "twitter",
  Instagram = "instagram",
  LinkedIn = "linkedin",
  YouTube = "youtube",
}

export enum TwitterSearchType {
  Keyword = "keyword",
  Hashtag = "hashtag",
  Handle = "handle",
}

export enum InstagramSearchType {
  Hashtag = "hashtag",
  ProfileURL = "profile_url",
}

export enum LinkedInInputType {
  CompanyPageURL = "company_url",
  PostLink = "post_url",
}

export enum YouTubeSearchType {
  Keyword = "keyword",
  ChannelName = "channel_name",
  VideoURL = "video_url",
}

export enum TimeRange {
  Past24Hours = "24h",
  Past7Days = "7d",
  Past30Days = "30d",
  Custom = "custom", // Custom might need date pickers in a full impl.
}

export const PLATFORM_DISPLAY_NAMES: Record<SocialPlatform, string> = {
  [SocialPlatform.GeneralText]: "General Text",
  [SocialPlatform.Twitter]: "Twitter/X",
  [SocialPlatform.Instagram]: "Instagram",
  [SocialPlatform.LinkedIn]: "LinkedIn",
  [SocialPlatform.YouTube]: "YouTube",
};
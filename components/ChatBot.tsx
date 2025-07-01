
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, ProcessedResponse, GroundingChunk } from '../types';
import { CARAMEL_AVATAR_URL, CARAMEL_FACE_URL } from '../constants';

interface ChatBotProps {
  getResponse: (history: ChatMessage[], newMessage: string) => Promise<ProcessedResponse>;
}

const BotMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="flex items-start space-x-3 mb-4">
    <img src={CARAMEL_AVATAR_URL} alt="Caramel AI" className="w-10 h-10 rounded-full" />
    <div className="bg-hnai-teal text-white p-3 rounded-lg max-w-xs sm:max-w-md shadow">
      <p className="text-sm">{message.text}</p>
    </div>
  </div>
);

const UserMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="flex items-start justify-end space-x-3 mb-4">
    <div className="bg-hnai-yellow text-hnai-dark-text p-3 rounded-lg max-w-xs sm:max-w-md shadow">
      <p className="text-sm">{message.text}</p>
    </div>
    {/* User avatar can be added here if desired */}
  </div>
);

export const ChatBot: React.FC<ChatBotProps> = ({ getResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'initial-bot', text: "Hi! I'm Caramel AI. How can I help you with your sentiment analysis results or marketing questions today?", sender: 'bot', timestamp: Date.now(), avatar: CARAMEL_AVATAR_URL }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await getResponse([...messages, newUserMessage], inputValue);
      
      let responseText = botResponse.text;
      if (botResponse.sources && botResponse.sources.length > 0) {
        responseText += "\n\n**Sources:**\n";
        botResponse.sources.forEach((source, index) => {
          responseText += `${index + 1}. [${source.web.title || source.web.uri}](${source.web.uri})\n`;
        });
      }

      const newBotMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: responseText,
        sender: 'bot',
        timestamp: Date.now(),
        avatar: CARAMEL_AVATAR_URL,
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setError("Sorry, I couldn't get a response. Please try again.");
      const errorBotMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        text: "I'm having trouble connecting right now. Please check your API key or try again later.",
        sender: 'bot',
        timestamp: Date.now(),
        avatar: CARAMEL_AVATAR_URL,
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, getResponse, messages]);


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 hnai-yellow-bg text-hnai-dark-text p-4 rounded-full shadow-xl hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-hnai-teal focus:ring-offset-2 transition-transform duration-200 ease-in-out hover:scale-110 z-50"
        aria-label="Toggle Chatbot"
      >
        <img src={CARAMEL_FACE_URL} alt="Caramel AI" className="w-8 h-8"/>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-40 border-2 border-hnai-teal overflow-hidden">
          {/* Header */}
          <div className="hnai-teal-bg text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src={CARAMEL_AVATAR_URL} alt="Caramel AI" className="w-10 h-10 rounded-full mr-3 border-2 border-hnai-yellow" />
              <h3 className="font-semibold text-lg">Caramel AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-hnai-yellow hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map(msg => (
              msg.sender === 'user' ? <UserMessage key={msg.id} message={msg} /> : <BotMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3 mb-4">
                <img src={CARAMEL_AVATAR_URL} alt="Caramel AI" className="w-10 h-10 rounded-full" />
                <div className="bg-hnai-teal text-white p-3 rounded-lg shadow">
                  <p className="text-sm italic">Caramel is thinking...</p>
                </div>
              </div>
            )}
             {error && <p className="text-red-500 text-xs px-2">{error}</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask Caramel..."
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hnai-teal focus:border-transparent outline-none bg-gradient-to-b from-gray-50 to-gray-100"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 hnai-teal-bg text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Send, Bot } from 'lucide-react';

// Predefined responses based on API documentation
const API_RESPONSES = {
  "search people": `You can use api.crustdata.com/screener/person/search endpoint. Here's an example curl request:

curl --location 'https://api.crustdata.com/screener/person/search' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Token $token' \\
--data '{
    "filters": [
        {
            "filter_type": "CURRENT_COMPANY",
            "type": "in",
            "value": ["openai.com"]
        },
        {
            "filter_type": "CURRENT_TITLE",
            "type": "in",
            "value": ["engineer"]
        },
        {
            "filter_type": "REGION",
            "type": "in",
            "value": ["San Francisco, California, United States"]
        }
    ],
    "page": 1
}'`,
  "region values": `Yes, there is a specific list of regions available at: https://crustdata-docs-region-json.s3.us-east-2.amazonaws.com/updated_regions.json

You should find the exact region name from this list before making the API call.`,
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm your Crustdata API assistant. Ask me anything about the API documentation!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple response matching
  const getResponse = (query) => {
    const lQuery = query.toLowerCase();
    if (lQuery.includes('search') && (lQuery.includes('people') || lQuery.includes('person'))) {
      return API_RESPONSES["search people"];
    }
    if (lQuery.includes('region') || lQuery.includes('location')) {
      return API_RESPONSES["region values"];
    }
    return "I'll help you with that! Please check our API documentation at https://www.notion.so/crustdata/Crustdata-Discovery-And-Enrichment-API for more details.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    // Add bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: getResponse(input) }]);
    }, 500);
    
    setInput('');
  };

  return (
    <div className={`h-screen w-full flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          {/* Logo */}
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4ade80" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" fill="#f87171" />
            <path d="M12 22V12" fill="#facc15" />
            <path d="M22 7v10" fill="#60a5fa" />
          </svg>
          <h1 className="text-xl font-bold">Crustdata API Support</h1>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'user' 
                ? `${isDark ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                : `${isDark ? 'bg-gray-800' : 'bg-gray-100'}`
            }`}>
              {message.type === 'bot' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Crustdata Assistant</span>
                </div>
              )}
              <pre className={`whitespace-pre-wrap font-sans ${message.type === 'bot' ? 'text-sm' : ''}`}>
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Crustdata APIs..."
            className={`flex-1 p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:border-blue-500'
            } outline-none`}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

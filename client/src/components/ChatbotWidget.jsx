import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am the Sri Krishna Engineering virtual assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { messages: [...messages.slice(1), userMessage] });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to my brain right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl bg-industrial-orange hover:bg-orange-600 text-white transition-transform duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-industrial-900 border border-industrial-700 rounded-lg shadow-[0_0_20px_rgba(234,88,12,0.15)] flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-industrial-800 rounded-t-lg border-b border-industrial-700">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-industrial-orange" />
            <h3 className="font-bold text-white">SKE Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-industrial-orange text-white rounded-br-none' : 'bg-industrial-800 text-gray-200 border border-industrial-700 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-industrial-800 border border-industrial-700 p-3 rounded-lg rounded-bl-none">
                <Loader2 size={16} className="animate-spin text-industrial-orange" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Access Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            <button onClick={() => setInput("What types of industrial valves do you have?")} className="bg-industrial-800 border border-industrial-700 text-xs text-gray-300 px-3 py-1.5 rounded-full hover:bg-industrial-700 hover:text-white transition-colors">
              Types of valves?
            </button>
            <button onClick={() => setInput("Do you offer bulk discounts?")} className="bg-industrial-800 border border-industrial-700 text-xs text-gray-300 px-3 py-1.5 rounded-full hover:bg-industrial-700 hover:text-white transition-colors">
              Bulk discounts?
            </button>
            <button onClick={() => setInput("What are your shipping policies?")} className="bg-industrial-800 border border-industrial-700 text-xs text-gray-300 px-3 py-1.5 rounded-full hover:bg-industrial-700 hover:text-white transition-colors">
              Shipping policies?
            </button>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-industrial-800 rounded-b-lg border-t border-industrial-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-industrial-900 border border-industrial-700 rounded p-2 text-sm text-white focus:outline-none focus:border-industrial-orange"
          />
          <button type="submit" disabled={!input.trim() || loading} className="bg-industrial-orange text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}

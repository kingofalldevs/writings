import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeepSeekResponse } from '../services/deepseek';

const AICompanion = ({ isOpen, onClose, context, ideabaseContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);
    try {
      // Combine editor context and ideabase context
      const fullContext = `
CURRENT EDITOR CONTENT:
${context || "No text in editor yet."}

IDEABASE REFERENCE (USER NOTES/RESEARCH):
${ideabaseContext || "No items in ideabase yet."}
      `.trim();

      const response = await getDeepSeekResponse(userMessage, fullContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to DeepSeek right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ai-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="h-full shrink-0 overflow-hidden flex flex-col bg-background"
        >
          {/* Inner content — fixed 360px wide regardless of animation */}
          <div className="w-[360px] h-full flex flex-col">
            {/* Header */}
            <div className="p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div>
                  <p className="text-[13px] font-bold text-foreground">Aria</p>
                  <p className="text-[10px] text-muted tracking-[0.1em] uppercase">Creativity</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg text-muted bg-transparent border-none cursor-pointer hover:bg-foreground/5 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted bg-transparent border-none cursor-pointer hover:bg-foreground/5 transition-colors"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 opacity-50">
                  <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center mb-2">
                    <MessageSquare size={24} className="text-accent" />
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed max-w-[220px]">
                    Ask anything about your reading. Aria will answer using your document as context.
                  </p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user'
                        ? 'bg-accent text-background rounded-br-sm self-end'
                        : 'bg-foreground/5 text-foreground rounded-bl-sm self-start'
                      }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex gap-1 px-3.5 py-2.5 rounded-2xl bg-foreground/5 w-fit self-start rounded-bl-sm">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 shrink-0">
              <div className="flex gap-2.5 items-end">
                <textarea
                  rows={2}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about this reading..."
                  className="flex-1 resize-none border-none rounded-xl px-3.5 py-2.5 text-[13px] bg-foreground/5 text-foreground outline-none font-sans leading-relaxed focus:bg-foreground/[0.08] transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="w-[38px] h-[38px] rounded-xl bg-accent text-background border-none cursor-pointer flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AICompanion;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What exactly is Crescendo?",
    answer: "Crescendo is a minimalist workspace designed specifically for deep cognitive work. It combines a distraction-free writing environment, a powerful PDF reader,and an optional AI assistant to help you to be more productive into a single, unified workspace."
  },
  {
    question: "Do I need to do any settings for my work or portfolio?",
    answer: "No, you don't need to do any settings for your work or portfolio. Crescendo is designed to be plug-and-play. Just start typing and we will handle the rest for you."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use industry-standard encryption for all data storage. Your documents and notes are private to you, and we never sell your data to third parties. We believe your creative process is sacred."
  },
  {
    question: "How does Aria AI work with my documents?",
    answer: "Aria acts as a collaborative partner. When you upload a document, Aria 'reads' it to provide context-aware summaries, help you brainstorm ideas, or answer specific questions. Your data is only used to assist you in real-time and is never used to train global AI models."
  },
  {
    question: "Can I use Crescendo for free?",
    answer: "Yes! We offer a generous free tier that includes all core focus features and a monthly allowance of AI interactions. For power users who need unlimited storage and advanced AI capabilities, we offer a premium subscription."
  },
  {
    question: "How does Crescendo handle my ideas and works- am I safe??",
    answer: "Your work is yours. We offer you a lincense on every idea you add to your ideabase and make sure to protect your data and privacy. We use industry-standard encryption for all data storage. Your documents and notes are private to you, and we never sell your data to third parties. We believe your creative process is sacred."
  }
];

const LandingFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="relative w-full py-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 font-sans text-foreground">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          <p className="text-lg opacity-60 font-light max-w-xl mx-auto">
            Everything you need to know about the Crescendo experience and how it can transform your workflow.
          </p>
        </motion.div>

        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border transition-all duration-300 ${activeIndex === index
                ? 'bg-foreground/[0.03] border-accent/30 shadow-lg shadow-accent/5'
                : 'bg-transparent border-foreground/10 hover:border-foreground/20'
                }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              >
                <span className={`text-lg font-medium transition-colors ${activeIndex === index ? 'text-accent' : 'text-foreground'}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  {activeIndex === index ? <Minus size={20} className="text-accent" /> : <Plus size={20} className="text-foreground/40" />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-base leading-relaxed opacity-70 font-light text-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;

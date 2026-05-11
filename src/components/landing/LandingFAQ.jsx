'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What exactly is Writings?",
    answer: "Writings is a minimalist workspace designed specifically for deep cognitive work. It combines a distraction-free writing environment, a powerful PDF reader,and an optional AI assistant to help you to be more productive into a single, unified workspace."
  },
  {
    question: "How do I publish my portfolio?",
    answer: "No, you don't need to do any settings for your work or portfolio. Writings is designed to be plug-and-play. Just start typing and we will handle the rest for you."
  },
  {
    question: "Is there a limit to how much I can write?",
    answer: "No, we believe in providing a space where you can let your ideas flow without restrictions. Whether you're working on a short story or a massive novel, we've got you covered."
  },
  {
    question: "Can I use Writings for free?",
    answer: "Yes! We offer a Zen (Free) plan that includes our core distraction-free writing environment, basic Ideabase organization, and one-click portfolio publishing."
  },
  {
    question: "How does Writings handle my ideas and works- am I safe??",
    answer: "Security and privacy are at our core. Your works are yours and yours alone. We use industry-standard encryption and security protocols to ensure that your intellectual property is protected."
  }
];

const LandingFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="relative w-full py-32 px-8 z-10 max-w-[1200px] mx-auto">
      <div className="flex flex-col items-center gap-16">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto"
        >
          <h2 className="font-medium tracking-tight font-sans text-[clamp(40px,5vw,48px)] leading-[1.1] text-foreground">
            Frequently Asked <span className="text-accent italic">Questions.</span>
          </h2>
          <p className="text-xl font-light opacity-60 leading-relaxed">
            Everything you need to know about the Writings experience and how it can transform your workflow.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl flex flex-col gap-4 mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl border transition-all duration-300 ${activeIndex === index
                ? 'bg-foreground/[0.03] border-accent/30'
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

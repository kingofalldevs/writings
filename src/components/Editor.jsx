'use client';
import { useRef } from 'react';

const Editor = ({ content, onChange, onFocus, isSelected }) => {
  const fileInputRef = useRef(null);

  return (
    <main className={`flex-1 flex justify-center px-4 md:px-16 overflow-y-auto h-full ${isSelected ? 'items-start pt-8 md:pt-16' : 'items-start pt-16 md:pt-24'}`}>
      <div className="animate-fade-in w-full max-w-[900px] relative">
        {!isSelected ? (
          <div className="h-full w-full flex items-start pt-8">
            <div className="w-[2px] h-8 bg-accent animate-[pulse_1s_infinite] rounded-full opacity-50" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            autoFocus
            placeholder="Start writing..."
            className="w-full h-[calc(100vh-180px)] bg-transparent border-none resize-none outline-none font-serif text-xl leading-[1.9] text-foreground text-left opacity-100 transition-all duration-500 pt-8 pb-32"
          />
        )}
      </div>
    </main>
  );
};

export default Editor;

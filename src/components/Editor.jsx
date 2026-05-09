import React, { useRef } from 'react';
import { FilePlus, Upload, Library, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// More reliable worker setup for Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const Editor = ({ content, onChange, onFocus, user, onOpenLibrary, onUpload, isSelected }) => {
  const fileInputRef = useRef(null);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        try {
          const text = await extractTextFromPDF(file);
          onUpload(text);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          alert('Failed to parse PDF. Please try a different file.');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpload(e.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className={`flex-1 flex justify-center px-16 overflow-y-auto h-full ${isSelected ? 'items-start pt-16' : 'items-start pt-24'}`}>
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

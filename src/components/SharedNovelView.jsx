'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SharedNovelView = ({ shareId }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedWork = async () => {
      try {
        const docRef = doc(db, 'shared_works', shareId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(data.content);
          setTitle(data.title || 'Untitled Work');
          setAuthor(data.authorName || 'Anonymous');
        } else {
          setError('This story could not be found.');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading the story.');
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedWork();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground gap-4">
        <BookOpen size={48} className="text-muted opacity-50" />
        <p className="text-xl font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-serif overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-24">
        <div className="text-center mb-24 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-lg text-muted italic">
            by {author}
          </p>
        </div>
        
        <div className="max-w-none text-lg md:text-xl leading-[2] whitespace-pre-wrap font-serif text-foreground/90">
          {content}
        </div>
        
        <div className="mt-32 text-center pb-24 opacity-30 flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-foreground"></div>
          <span className="text-sm font-sans tracking-widest uppercase">The End</span>
        </div>
      </div>
    </div>
  );
};

export default SharedNovelView;

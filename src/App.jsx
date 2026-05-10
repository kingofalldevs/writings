import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Editor from './components/Editor';
import AudioPlayer from './components/AudioPlayer';
import LibraryModal from './components/LibraryModal';
import AICompanion from './components/AICompanion';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import AriaPage from './components/AriaPage';
import PhilosophyPage from './components/PhilosophyPage';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import WorkNameModal from './components/WorkNameModal';
import SharedNovelView from './components/SharedNovelView';
import AuthorPortfolio from './components/AuthorPortfolio';
import AccountPage from './components/AccountPage';
import PortfolioEditor from './components/PortfolioEditor';
import NotificationModal from './components/NotificationModal';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import { useAuth } from './context/AuthContext';
import Binder from './components/Binder';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, setDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, getDocs } from 'firebase/firestore';
import { tracks } from './data/tracks';

function AppContent() {
  const [view, setView] = useState('landing'); // 'landing', 'pricing', 'aria', 'philosophy', 'dashboard', 'account', 'portfolio-editor', 'terms', 'privacy'
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [editorContent, setEditorContent] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentWorkId, setCurrentWorkId] = useState(null);
  const [currentWorkName, setCurrentWorkName] = useState('');
  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(window.innerWidth > 768);
  const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success', copyText: null, onConfirm: null, confirmText: 'Got it', cancelText: 'Cancel' });
  const { user, logout, loading } = useAuth();

  const showNotif = (title, message, type = 'success', extras = {}) => {
    setNotif({ isOpen: true, title, message, type, copyText: extras.copyText || null, onConfirm: extras.onConfirm || null, confirmText: extras.confirmText || 'Got it', cancelText: extras.cancelText || 'Cancel' });
  };
  const closeNotif = () => setNotif(n => ({ ...n, isOpen: false }));

  // Keyboard shortcuts for Zen Mode
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'z') {
        setIsBinderOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scrivener-style Binder Data
  const [binderData, setBinderData] = useState({
    ideabase: [],
    research: [],
    trash: []
  });

  // Fetch works and organize into binder
  React.useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users', user.uid, 'works'), orderBy('name', 'asc'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Auto-initialize Idea 1 if it doesn't exist
        const idea1Exists = works.find(w => w.name === 'Idea 1' && w.type === 'folder' && !w.parentId);
        if (!idea1Exists && works.length === 0) {
          // 1. Create Idea 1 Folder
          const ideaRef = await addDoc(collection(db, 'users', user.uid, 'works'), {
            name: 'Idea 1',
            type: 'folder',
            section: 'ideabase',
            parentId: null,
            timestamp: serverTimestamp()
          });

          // 2. Storyline (File)
          await addDoc(collection(db, 'users', user.uid, 'works'), {
            name: 'Storyline',
            type: 'document',
            content: '',
            section: 'ideabase',
            parentId: ideaRef.id,
            timestamp: serverTimestamp()
          });

          // 3. Characters (Folder)
          await addDoc(collection(db, 'users', user.uid, 'works'), {
            name: 'Characters',
            type: 'folder',
            section: 'ideabase',
            parentId: ideaRef.id,
            timestamp: serverTimestamp()
          });

          // 4. Chapters (Folder)
          await addDoc(collection(db, 'users', user.uid, 'works'), {
            name: 'Chapters',
            type: 'folder',
            section: 'ideabase',
            parentId: ideaRef.id,
            timestamp: serverTimestamp()
          });

          return;
        }

        // Helper to build recursive tree
        const buildTree = (parentId = null) => {
          const filtered = works.filter(w => w.parentId === parentId);
          return filtered
            .sort((a, b) => {
              const nameA = (a.name || '').trim().toLowerCase();
              const nameB = (b.name || '').trim().toLowerCase();
              return nameA.localeCompare(nameB);
            })
            .map(w => ({
              ...w,
              children: buildTree(w.id)
            }));
        };

        const ideabaseTree = buildTree(null).filter(w => w.section === 'ideabase' || !w.section);
        const researchTree = buildTree(null).filter(w => w.section === 'research');
        const trashTree = buildTree(null).filter(w => w.section === 'trash');

        setBinderData({
          ideabase: ideabaseTree,
          research: researchTree,
          trash: trashTree
        });
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Redirect to dashboard when logged in
  React.useEffect(() => {
    if (!loading && user && (view === 'landing' || view === 'pricing' || view === 'aria' || view === 'philosophy')) {
      setView('dashboard');
    }
  }, [user, loading, view]);

  const handleStartJourney = () => {
    if (user) {
      setView('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleEditorFocus = () => {
    if (!currentWorkId && !currentWorkName && editorContent === '') {
      setIsNamingModalOpen(true);
    }
  };

  const handleSelectWork = (work) => {
    setCurrentWorkId(work.id);
    setCurrentWorkName(work.name);
    setSelectedItemId(work.id);
    setEditorContent(work.content || '');
  };

  const handleSelectBinderItem = (item) => {
    setSelectedItemId(item.id);
    if (item.type === 'document') {
      setCurrentWorkId(item.id);
      setCurrentWorkName(item.name);
      setEditorContent(item.content || '');
    } else {
      // If it's a folder, we clear the current work so the editor shows the empty state
      setCurrentWorkId(null);
      setCurrentWorkName('');
      setEditorContent('');
    }
  };

  const handleAddItem = async (parentId, type, section = 'ideabase') => {
    if (!user) return;

    // RESET LOGIC
    if (type === 'reset') {
      const q = query(collection(db, 'users', user.uid, 'works'));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'users', user.uid, 'works', d.id)));
      await Promise.all(deletePromises);
      return;
    }

    // Find the parent item to check context
    const allItems = [...binderData.ideabase, ...binderData.research, ...binderData.trash];
    const findInTree = (items, id) => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findInTree(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parentItem = findInTree(allItems, parentId);

    // TEMPLATE: New Idea inside Ideabase root
    if (section === 'ideabase' && !parentId && type === 'folder') {
      const ideaName = prompt("Enter Idea Name:", `Idea ${binderData.ideabase.length + 1}`);
      if (!ideaName) return;

      // Create Idea Folder
      const ideaRef = await addDoc(collection(db, 'users', user.uid, 'works'), {
        name: ideaName,
        type: 'folder',
        section,
        parentId: null,
        timestamp: serverTimestamp()
      });

      // 1. Storyline (File)
      await addDoc(collection(db, 'users', user.uid, 'works'), {
        name: 'Storyline',
        type: 'document',
        content: '',
        section,
        parentId: ideaRef.id,
        timestamp: serverTimestamp()
      });

      // 2. Characters (Folder)
      await addDoc(collection(db, 'users', user.uid, 'works'), {
        name: 'Characters',
        type: 'folder',
        section,
        parentId: ideaRef.id,
        timestamp: serverTimestamp()
      });

      // 3. Chapters (Folder)
      await addDoc(collection(db, 'users', user.uid, 'works'), {
        name: 'Chapters',
        type: 'folder',
        section,
        parentId: ideaRef.id,
        timestamp: serverTimestamp()
      });

      return;
    }

    // Default Creation
    const name = type === 'folder' ? 'New Folder' : 'Untitled Document';
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'works'), {
        name: name,
        content: '',
        type: type,
        section: section,
        parentId: parentId || null,
        timestamp: serverTimestamp()
      });

      if (type === 'document') {
        setCurrentWorkId(docRef.id);
        setCurrentWorkName(name);
        setSelectedItemId(docRef.id);
        setEditorContent('');
      }
    } catch (e) {
      console.error("Error adding item: ", e);
    }
  };

  const handleDeleteItem = (id) => {
    if (!user) return;
    showNotif(
      'Delete item',
      'This action is permanent and cannot be undone.',
      'warning',
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'works', id));
            if (currentWorkId === id) {
              setCurrentWorkId(null);
              setCurrentWorkName('');
              setEditorContent('');
              setSelectedItemId(null);
            }
          } catch (e) {
            console.error('Error deleting item: ', e);
            showNotif('Error', 'Failed to delete the item.', 'error');
          }
        }
      }
    );
  };

  const handleRenameItem = async (item) => {
    if (!user) return;
    const newName = prompt("Enter new name:", item.name);
    if (newName && newName !== item.name) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'works', item.id), {
          name: newName,
          timestamp: serverTimestamp()
        });
        if (currentWorkId === item.id) {
          setCurrentWorkName(newName);
        }
      } catch (e) {
        console.error("Error renaming item: ", e);
      }
    }
  };

  const handleQuickPublish = async () => {
    if (!user) {
      showNotif('Sign in required', 'Please sign in to publish your portfolio.', 'warning');
      return;
    }

    try {
      const { getDoc } = await import('firebase/firestore');
      const defaultUsername = user.displayName?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0]?.toLowerCase() || 'author';
      const docRef = doc(db, 'portfolios', defaultUsername);
      const docSnap = await getDoc(docRef);

      let portfolioData = {};
      if (docSnap.exists()) {
        portfolioData = docSnap.data();
      } else {
        const username = prompt("Enter your unique author handle:", defaultUsername);
        if (!username) return;
        portfolioData = {
          authorName: user.displayName || username,
          username: username.toLowerCase(),
          bio: "Author at Writings.",
          inspirations: "Minimalism and Narrative."
        };
      }

      const worksSnapshot = await getDocs(query(collection(db, 'users', user.uid, 'works')));
      const works = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));

      await setDoc(doc(db, 'portfolios', portfolioData.username.toLowerCase()), {
        ...portfolioData,
        uid: user.uid,
        works: works,
        timestamp: serverTimestamp()
      });

      const shareUrl = `${window.location.origin}/?author=${portfolioData.username.toLowerCase()}`;
      navigator.clipboard.writeText(shareUrl);
      showNotif('Portfolio updated!', 'Your portfolio is live. Link copied to clipboard.', 'success', { copyText: shareUrl });
    } catch (e) {
      console.error("Error quick publishing: ", e);
      showNotif('Publish failed', 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleShareWork = async () => {
    if (!user) {
      showNotif('Sign in required', 'Please sign in to publish your portfolio.', 'warning');
      return;
    }

    const defaultUsername = user.displayName?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0]?.toLowerCase() || 'author';
    const username = prompt("Enter your unique author handle (e.g. prince) to publish your portfolio:", defaultUsername);

    const bio = prompt("A short bio about you as a writer:", "Crafting narratives at the intersection of architecture, philosophy, and the quiet moments of the everyday.");
    const inspirations = prompt("Your inspirations (e.g. minimalist design, natural world):", "Inspired by the minimalist lines of design, classical music, and the raw beauty of the natural world.");

    if (!username) return;

    try {
      const worksSnapshot = await getDocs(query(collection(db, 'users', user.uid, 'works')));
      const works = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));

      const authorName = user.displayName || username;

      await setDoc(doc(db, 'portfolios', username.toLowerCase()), {
        uid: user.uid,
        authorName: authorName,
        username: username.toLowerCase(),
        bio: bio,
        inspirations: inspirations,
        works: works,
        timestamp: serverTimestamp()
      });

      const shareUrl = `${window.location.origin}/?author=${username.toLowerCase()}`;
      navigator.clipboard.writeText(shareUrl);
      showNotif('Portfolio is live! 🎉', 'Your author page is published. Link copied to clipboard.', 'success', { copyText: shareUrl });
    } catch (e) {
      console.error("Error publishing portfolio: ", e);
      showNotif('Publish failed', 'Something went wrong. Please try again.', 'error');
    }
  };

  const getIdeabaseContext = () => {
    const extractText = (items) => {
      let text = '';
      items.forEach(item => {
        if (item.type === 'document' && item.content) {
          text += `### DOCUMENT: ${item.name}\n${item.content}\n\n`;
        }
        if (item.children) {
          text += extractText(item.children);
        }
      });
      return text;
    };
    return extractText(binderData.ideabase);
  };

  const handleSaveWorkName = async (name) => {
    if (!user) return;
    try {
      if (currentWorkId) {
        // Update existing
        await updateDoc(doc(db, 'users', user.uid, 'works', currentWorkId), {
          name: name,
          timestamp: serverTimestamp()
        });
        setCurrentWorkName(name);
      } else {
        // Create new
        const docRef = await addDoc(collection(db, 'users', user.uid, 'works'), {
          name: name,
          content: editorContent,
          type: 'document',
          section: 'ideabase',
          parentId: null,
          timestamp: serverTimestamp()
        });
        setCurrentWorkId(docRef.id);
        setSelectedItemId(docRef.id);
        setCurrentWorkName(name);
      }
      setIsNamingModalOpen(false);
    } catch (e) {
      console.error("Error saving work name: ", e);
    }
  };

  // Check for payment success in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      showNotif('Welcome to Writings Pro!', 'Your subscription is active and your features are being unlocked.', 'success');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [showNotif]);

  // Auto-save logic
  React.useEffect(() => {
    if (user && currentWorkId && editorContent !== undefined) {
      const timeoutId = setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'users', user.uid, 'works', currentWorkId), {
            content: editorContent,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [editorContent, currentWorkId, user]);

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          user={user}
          onAccount={() => setView('account')}
          onStart={handleStartJourney}
          onPricing={() => setView('pricing')}
          onAria={() => setView('aria')}
          onPhilosophy={() => setView('philosophy')}
          onTerms={() => setView('terms')}
          onPrivacy={() => setView('privacy')}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onTerms={() => { setIsAuthModalOpen(false); setView('terms'); }}
          onPrivacy={() => { setIsAuthModalOpen(false); setView('privacy'); }}
        />
      </>
    );
  }

  if (view === 'terms') {
    return <TermsPage onBack={() => setView('landing')} onPricing={() => setView('pricing')} onAria={() => setView('aria')} onPhilosophy={() => setView('philosophy')} onTerms={() => setView('terms')} onPrivacy={() => setView('privacy')} />;
  }

  if (view === 'privacy') {
    return <PrivacyPage onBack={() => setView('landing')} onPricing={() => setView('pricing')} onAria={() => setView('aria')} onPhilosophy={() => setView('philosophy')} onTerms={() => setView('terms')} onPrivacy={() => setView('privacy')} />;
  }

  if (view === 'pricing') {
    return (
      <>
        <PricingPage
          onStart={handleStartJourney}
          onBack={() => setView('landing')}
          onPricing={() => setView('pricing')}
          onAria={() => setView('aria')}
          onPhilosophy={() => setView('philosophy')}
          onTerms={() => setView('terms')}
          onPrivacy={() => setView('privacy')}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onTerms={() => { setIsAuthModalOpen(false); setView('terms'); }}
          onPrivacy={() => { setIsAuthModalOpen(false); setView('privacy'); }}
        />
      </>
    );
  }

  if (view === 'aria') {
    return (
      <>
        <AriaPage
          onStart={handleStartJourney}
          onBack={() => setView('landing')}
          onPricing={() => setView('pricing')}
          onAria={() => setView('aria')}
          onPhilosophy={() => setView('philosophy')}
          onTerms={() => setView('terms')}
          onPrivacy={() => setView('privacy')}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onTerms={() => { setIsAuthModalOpen(false); setView('terms'); }}
          onPrivacy={() => { setIsAuthModalOpen(false); setView('privacy'); }}
        />
      </>
    );
  }

  if (view === 'philosophy') {
    return (
      <>
        <PhilosophyPage
          onStart={handleStartJourney}
          onBack={() => setView('landing')}
          onPricing={() => setView('pricing')}
          onAria={() => setView('aria')}
          onPhilosophy={() => setView('philosophy')}
          onTerms={() => setView('terms')}
          onPrivacy={() => setView('privacy')}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onTerms={() => { setIsAuthModalOpen(false); setView('terms'); }}
          onPrivacy={() => { setIsAuthModalOpen(false); setView('privacy'); }}
        />
      </>
    );
  }

  if (view === 'account') {
    return (
      <AccountPage
        user={user}
        onLogout={() => {
          logout();
          setView('landing');
        }}
        onBack={() => setView('dashboard')}
        onStart={() => setView('dashboard')}
        showNotif={showNotif}
        onPricing={() => setIsPricingModalOpen(true)}
      />
    );
  }

  if (view === 'portfolio-editor') {
    return (
      <PortfolioEditor
        user={user}
        onBack={() => setView('dashboard')}
        onStart={() => setView('dashboard')}
        showNotif={showNotif}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        onUpload={setEditorContent}
        onShare={handleShareWork}
        canShare={!!user}
        onToggleAI={() => setIsAIOpen(o => !o)}
        isAIOpen={isAIOpen}
        onTogglePlayer={() => setIsPlayerVisible(o => !o)}
        isPlayerVisible={isPlayerVisible}
        onLogoClick={() => setView('landing')}
        user={user}
        onLogout={logout}
        onAccount={() => setView('account')}
        onPortfolioEditor={() => setView('portfolio-editor')}
        onQuickPublish={handleQuickPublish}
        onSignIn={() => setIsAuthModalOpen(true)}
        onToggleLibrary={() => setIsLibraryOpen(true)}
        onToggleBinder={() => setIsBinderOpen(o => !o)}
        isBinderOpen={isBinderOpen}
        onPricing={() => setIsPricingModalOpen(true)}
      />

      <div className="animate-fade-in flex flex-1 mt-16 overflow-hidden">
        {isBinderOpen && (
          <Binder
            data={binderData}
            selectedId={selectedItemId}
            onSelect={handleSelectBinderItem}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onRenameItem={handleRenameItem}
            onClose={() => setIsBinderOpen(false)}
          />
        )}

        <Editor
          content={editorContent}
          onChange={setEditorContent}
          onFocus={handleEditorFocus}
          user={user}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onUpload={setEditorContent}
          isSelected={!!currentWorkId}
        />

        <AICompanion
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          context={editorContent}
          ideabaseContext={getIdeabaseContext()}
        />
      </div>


      <WorkNameModal
        isOpen={isNamingModalOpen}
        onSave={handleSaveWorkName}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      <NotificationModal
        isOpen={notif.isOpen}
        onClose={closeNotif}
        title={notif.title}
        message={notif.message}
        type={notif.type}
        copyText={notif.copyText}
        onConfirm={notif.onConfirm}
        confirmText={notif.confirmText}
        cancelText={notif.cancelText}
      />

      <AudioPlayer
        currentTrack={currentTrack}
        onToggleLibrary={() => setIsLibraryOpen(true)}
        isVisible={isPlayerVisible}
        onClose={() => setIsPlayerVisible(false)}
      />
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTrack={setCurrentTrack}
        currentTrackId={currentTrack.id}
        onSelectWork={handleSelectWork}
      />
    </div>
  );
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');
  const authorUsername = urlParams.get('author');

  return (
    <AuthProvider>
      <ThemeProvider>
        {authorUsername ? <AuthorPortfolio authorUsername={authorUsername} /> :
          shareId ? <SharedNovelView shareId={shareId} /> :
            <AppContent />}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

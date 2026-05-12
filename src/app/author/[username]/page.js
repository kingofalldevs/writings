import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import AuthorPortfolio from "@/components/AuthorPortfolio";

export async function generateMetadata({ params }) {
  try {
    const { username } = await params;
    if (!db) return { title: "Author Portfolio | Writings" };
    
    const docRef = doc(db, "portfolios", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        title: `${data.authorName} | Author Portfolio`,
        description: data.bio || `Explore the works of ${data.authorName} on Writings.`,
        openGraph: {
          title: `${data.authorName} | Author Portfolio`,
          description: data.bio || `Explore the works of ${data.authorName} on Writings.`,
          images: data.profileImage ? [data.profileImage] : [],
        },
      };
    }
  } catch (err) {
    console.error("Metadata fetch failed:", err);
  }

  return {
    title: "Author Portfolio | Writings",
  };
}

export default async function PortfolioPage({ params }) {
  const { username } = await params;
  
  try {
    // Fetch Author Data
    const authorRef = doc(db, "portfolios", username);
    const authorSnap = await getDoc(authorRef);
    
    if (!authorSnap.exists()) {
      return <AuthorPortfolio authorUsername={username} />;
    }

    const authorData = authorSnap.data();
    
    // Transform data
    const works = authorData.works || [];
    const topLevelFolders = works.filter(w => w.type === 'folder' && !w.parentId);
    const documents = works.filter(w => w.type === 'document');
    const topLevelDocs = documents.filter(d => !d.parentId);

    const getDocsInFolder = (folderId) => {
      let docs = documents.filter(d => d.parentId === folderId);
      const folders = works.filter(w => w.type === 'folder');
      const subFolders = folders.filter(f => f.parentId === folderId);
      subFolders.forEach(sub => {
        docs = [...docs, ...getDocsInFolder(sub.id)];
      });
      return docs;
    };

    const stories = topLevelFolders.map(folder => {
      const children = getDocsInFolder(folder.id)
        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
      const combinedContent = children.map(c => c.content).join('\n\n');
      return {
        id: folder.id,
        name: folder.name,
        content: combinedContent,
        children: children,
        childCount: children.length,
        type: 'story'
      };
    }).filter(s => s.content.trim().length > 0);

    const articles = topLevelDocs.map(doc => ({
       ...doc,
       type: 'article',
       childCount: 1
    }));

    const initialData = { 
      ...authorData, 
      stories,
      articles,
      blog: []
    };

    return <AuthorPortfolio authorUsername={username} initialData={initialData} />;
  } catch (err) {
    console.error("Server-side Firestore fetch failed:", err);
    // Fallback to purely client-side rendering if server fetch fails
    return <AuthorPortfolio authorUsername={username} />;
  }
}

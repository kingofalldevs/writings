import React, { cache } from "react";
import AuthorPortfolio from "../../../components/AuthorPortfolio";

// Deduplicate Firestore reads between metadata and the page itself
// Using native fetch to the REST API completely bypasses the Next.js/Turbopack GRPC crash bug.
const getPortfolio = cache(async (username) => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) return null;
  
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/portfolios/${username}`;
    const res = await fetch(url, { cache: 'no-store' }); // Use dynamic fetching to ensure live data
    if (!res.ok) return null;
    
    const doc = await res.json();
    
    // Parse Firestore REST format to native JS objects
    function parseValue(value) {
      if (!value) return null;
      if (value.stringValue !== undefined) return value.stringValue;
      if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
      if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
      if (value.booleanValue !== undefined) return value.booleanValue;
      if (value.timestampValue !== undefined) return { seconds: Math.floor(new Date(value.timestampValue).getTime() / 1000) };
      if (value.mapValue !== undefined) {
        const result = {};
        const fields = value.mapValue.fields || {};
        for (const key in fields) {
          result[key] = parseValue(fields[key]);
        }
        return result;
      }
      if (value.arrayValue !== undefined) {
        const values = value.arrayValue.values || [];
        return values.map(v => parseValue(v));
      }
      if (value.nullValue !== undefined) return null;
      return value;
    }

    const data = {};
    if (doc.fields) {
      for (const key in doc.fields) {
        data[key] = parseValue(doc.fields[key]);
      }
    }
    return Object.keys(data).length > 0 ? data : null;
  } catch (err) {
    console.warn("REST API fetch failed:", err);
    return null;
  }
});

export async function generateMetadata({ params }) {
  try {
    const { username } = await params;
    const data = await getPortfolio(username);

    if (data) {
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
    // Fetch Author Data using cached function
    const authorData = await getPortfolio(username);
    
    if (!authorData) {
      return <AuthorPortfolio authorUsername={username} />;
    }

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
    return <AuthorPortfolio authorUsername={username} />;
  }
}

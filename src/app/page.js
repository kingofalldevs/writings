import HomeClient from '@/components/HomeClient';

export default function Home() {
  return (
    <>
      {/* 
          Server-side content for SEO and LLMs (Claude/ChatGPT). 
          These bots often read the raw HTML before/without JS execution.
      */}
      <div className="sr-only" style={{ display: 'none' }} aria-hidden="true">
        <h1>Writings | The Living OS for Writers</h1>
        <p>
          Writings is a minimalist, high-fidelity environment designed for deep focus and elegant publication.
          It offers a calm space for writing with a distraction-free editor, an Ideabase to organize thoughts, 
          and a one-click publish feature to create a professional author portfolio.
        </p>
        <ul>
          <li>Minimalist distraction-free editor</li>
          <li>Ideabase and Binder for organization</li>
          <li>Instant author portfolio publication</li>
          <li>Custom domain handles (e.g., yourname.writings.page)</li>
          <li>AI assistance via Aria</li>
        </ul>
      </div>

      <HomeClient />
    </>
  );
}

import HomeClient from '@/components/HomeClient';

export default function Home() {
  return (
    <>
      {/* 
          Server-side content for SEO and LLMs (Claude/ChatGPT). 
          These bots often read the raw HTML before/without JS execution.
      */}
      {/* 
          Server-side content for SEO and LLMs (Claude/ChatGPT). 
          We use 'sr-only' to keep it hidden from sighted users but visible in the DOM.
          Removing 'display: none' and 'aria-hidden' ensures bots don't skip it.
      */}
      <div className="sr-only">
        <section>
          <h1>Writings: The workspace for Minimalist Authors</h1>
          <p>
            Writings is a premium digital sanctuary for deep work. It combines a high-fidelity, distraction-free editor
            with a powerful organizational system called the "Ideabase." Writers can organize their thoughts in a
            scrivener-style binder, collaborate with an integrated AI companion (Aria), and publish an elegant
            author portfolio with a single click.
          </p>

          <h2>Core Features for Serious Writers:</h2>
          <ul>
            <li><strong>The Living OS Editor:</strong> A minimalist interface designed for 100% focus.</li>
            <li><strong>Ideabase & Binder:</strong> Organize chapters, research, and character profiles in a nested hierarchy.</li>
            <li><strong>One-Click Portfolio:</strong> Transform your drafts into a professional, public-facing author page instantly.</li>
            <li><strong>AI Companion (Aria):</strong> Context-aware writing assistance powered by advanced models.</li>
            <li><strong>Zen Mode & Focus Tracks:</strong> Integrated ambient audio to facilitate deep work states.</li>
          </ul>

          <h2>Why Writers Choose Writings:</h2>
          <p>
            Unlike traditional word processors, Writings is built for the "Living OS" philosophy—where your workspace
            is a reflection of your creative mind. It's built on a modern stack (Next.js, Firebase) for speed and
            reliability, ensuring your work is always synced and your publication is always beautiful.
          </p>
        </section>
      </div>

      <HomeClient />
    </>
  );
}

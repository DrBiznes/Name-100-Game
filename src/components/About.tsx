import type { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { TableOfContents } from './TableOfContents';
import { Note } from './ui/Note';
import AboutContent from '../content/about.mdx';

interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

interface LinkProps extends ComponentProps {
  href?: string;
}

interface ImageProps extends ComponentProps {
  src?: string;
  alt?: string;
}

// Helper to create ID from heading text
const createId = (text: string) => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export function About() {
  const components = {
    h1: ({ children, ...props }: ComponentProps) => {
      const id = createId(children?.toString() || '');
      return (
        <h1 
          id={id}
          className="text-4xl font-bold mb-8 font-['Chonburi'] text-foreground scroll-mt-8 text-glow" 
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: ComponentProps) => {
      const id = createId(children?.toString() || '');
      return (
        <h2 
          id={id}
          className="text-3xl font-bold mt-16 mb-8 font-['Chonburi'] text-foreground scroll-mt-8 text-glow" 
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: ComponentProps) => {
      const id = createId(children?.toString() || '');
      return (
        <h3 
          id={id}
          className="text-2xl font-bold mt-12 mb-6 font-['Chonburi'] text-foreground scroll-mt-8 text-glow" 
          {...props}
        >
          {children}
        </h3>
      );
    },
    p: ({ children }: ComponentProps) => (
      <p className="mb-6 leading-relaxed text-[var(--about-text)]">
        {children}
      </p>
    ),
    ul: ({ children }: ComponentProps) => (
      <ul className="list-disc pl-6 mb-6 text-[var(--about-text)] space-y-2">
        {children}
      </ul>
    ),
    li: ({ children }: ComponentProps) => (
      <li>{children}</li>
    ),
    pre: ({ children }: ComponentProps) => (
      <div className="my-4 rounded-lg border border-border bg-card overflow-hidden">
        <div className="relative overflow-x-auto py-4 px-4">
          {children}
        </div>
      </div>
    ),
    code: ({ children }: ComponentProps) => (
      <code className="text-[var(--about-text-bright)] px-1 py-0.5 bg-muted rounded whitespace-pre">
        {children}
      </code>
    ),
    a: ({ children, href }: LinkProps) => (
      <a 
        href={href} 
        className="text-[var(--about-text-bright)] hover:text-[var(--about-text-dim)] underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }: ImageProps) => (
      <figure className="my-8 flex flex-col items-center">
        <img 
          src={src} 
          alt={alt} 
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
        {alt && (
          <figcaption className="mt-2 text-sm text-[var(--about-text-muted)] italic w-full text-center">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    blockquote: ({ children }: ComponentProps) => (
      <blockquote className="border-l-4 border-[var(--about-text-dim)] pl-4 italic my-4 text-[var(--about-text-muted)]">
        {children}
      </blockquote>
    ),
    Note: ({ number, children }: { number: number; children: ReactNode }) => (
      <Note number={number}>{children}</Note>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[120rem] mx-auto px-4 py-8 flex justify-center flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(1000px,_1fr)_250px] gap-8 w-full px-4">
          {/* Table of Contents - Left Column */}
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] overflow-visible px-4">
            <TableOfContents />
          </div>

          {/* Main Content - Middle Column */}
          <div className="min-w-0 max-w-[1400px] mx-auto">
            {/* Header Title Area */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 font-['Chonburi'] text-[var(--about-text)] leading-tight text-glow">
                THE GOAL:<br />
                NAME EVERY<br />
                WOMAN
              </h1>
              <div className="text-lg text-[var(--about-text-muted)] mb-2 italic">
                A simple task for someone of my skillset
              </div>
              <div className="text-[var(--about-text-muted)] italic">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* MDX Content Area */}
            <div className="prose prose-invert prose-lg max-w-none [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent [&_code]:whitespace-pre [&_pre]:overflow-x-auto prose-p:max-w-none prose-headings:max-w-none">
              <MDXProvider components={components}>
                <AboutContent />
              </MDXProvider>
            </div>
          </div>

          {/* Notes Area - Right Column */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] overflow-auto">
            {/* Notes will be positioned here by the Note component */}
          </div>
        </div>
      </div>

      {/* Social Footer - Full width and centered with viewport */}
      <footer className="w-full py-16 flex flex-col items-center gap-4">
        <div className="text-lg font-['Alegreya'] italic font-medium text-[var(--header)] text-glow">
          Thanks for playing!!!!
        </div>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/DrBiznes/Name-100-Game"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
            aria-label="GitHub Repository"
          >
            <svg 
              height="24" 
              aria-hidden="true" 
              viewBox="0 0 16 16" 
              version="1.1" 
              width="24" 
              fill="currentColor"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
              }}
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
          <a
            href="https://twitter.com/drbiznez"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
            aria-label="Twitter Profile"
          >
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
              }}
            >
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </svg>
          </a>
          <a
            href="https://jamino.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
            aria-label="Personal Website"
          >
            <span 
              className="material-symbols-outlined" 
              style={{ 
                fontSize: '1.5rem', 
                fontVariationSettings: "'FILL' 1",
                filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
              }}
            >
              language
            </span>
          </a>
          <a
            href="https://jamino.me/email"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
            aria-label="Email Contact"
          >
            <span 
              className="material-symbols-outlined" 
              style={{ 
                fontSize: '1.5rem', 
                fontVariationSettings: "'FILL' 1",
                filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
              }}
            >
              mail
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
} 
import React, { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { TableOfContents } from './TableOfContents';
import { CodeBlock } from './ui/CodeBlock';
import { Note } from './ui/Note';
import AboutContent from '../content/about.mdx';

interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

interface CodeProps extends ComponentProps {
  inline?: boolean;
  className?: string;
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
          className="text-4xl font-bold mb-8 font-['Chonburi'] text-header scroll-mt-8" 
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
          className="text-3xl font-bold mt-16 mb-8 font-['Chonburi'] text-header scroll-mt-8" 
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
          className="text-2xl font-bold mt-12 mb-6 font-['Chonburi'] text-header scroll-mt-8" 
          {...props}
        >
          {children}
        </h3>
      );
    },
    p: ({ children }: ComponentProps) => (
      <p className="mb-6 leading-relaxed text-foreground/90 max-w-2xl">
        {children}
      </p>
    ),
    ul: ({ children }: ComponentProps) => (
      <ul className="list-disc pl-6 mb-6 text-foreground/90 max-w-2xl space-y-2">
        {children}
      </ul>
    ),
    li: ({ children }: ComponentProps) => (
      <li>{children}</li>
    ),
    code: ({ inline, className, children }: CodeProps) => {
      if (inline) {
        return <code className="text-primary px-1 py-0.5 bg-muted rounded">{children}</code>;
      }
      const language = className?.replace(/language-/, '');
      return (
        <CodeBlock language={language}>{children as string}</CodeBlock>
      );
    },
    a: ({ children, href }: LinkProps) => (
      <a 
        href={href} 
        className="text-primary hover:text-accent underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }: ImageProps) => (
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-lg my-8 max-w-full h-auto"
      />
    ),
    blockquote: ({ children }: ComponentProps) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    // Add the CodeBlock component to the MDX components
    CodeBlock: ({ children, ...props }: any) => (
      <CodeBlock {...props}>{children}</CodeBlock>
    ),
    Note: ({ number, children }: { number: number; children: ReactNode }) => (
      <Note number={number}>{children}</Note>
    ),
  };

  return (
    <div className="max-w-[120rem] mx-auto px-4 py-8 flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(800px,_1fr)_250px] gap-8 w-full">
        {/* Table of Contents - Left Column */}
        <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] overflow-auto">
          <TableOfContents />
        </div>

        {/* Main Content - Middle Column */}
        <div className="min-w-0 max-w-[1200px] mx-auto">
          {/* Header Title Area */}
          <div className="mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 font-['Chonburi'] text-header leading-tight">
              THE GOAL:<br />
              NAME EVERY<br />
              WOMAN
            </h1>
            <div className="text-lg text-muted-foreground/80 mb-2">
              A simple task for someone of my skillset
            </div>
            <div className="text-primary/80 italic">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* MDX Content Area */}
          <div className="prose prose-invert prose-lg max-w-none">
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
  );
} 
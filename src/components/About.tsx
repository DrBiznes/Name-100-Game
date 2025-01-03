import React, { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { TableOfContents } from './TableOfContents';
import { CodeBlock } from './ui/CodeBlock';
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

export function About() {
  const components = {
    h1: ({ children, ...props }: ComponentProps) => (
      <h1 className="text-4xl font-bold mb-8 font-['Chonburi'] text-muted-foreground" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentProps) => (
      <h2 className="text-3xl font-bold mt-12 mb-6 font-['Chonburi'] text-muted-foreground" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentProps) => (
      <h3 className="text-2xl font-bold mt-8 mb-4 font-['Chonburi'] text-muted-foreground" {...props}>
        {children}
      </h3>
    ),
    p: ({ children }: ComponentProps) => (
      <p className="mb-4 leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
    ul: ({ children }: ComponentProps) => (
      <ul className="list-disc pl-6 mb-4 text-muted-foreground">
        {children}
      </ul>
    ),
    li: ({ children }: ComponentProps) => (
      <li className="mb-2">{children}</li>
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
    )
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Title Area */}
      <div className="mb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-['Chonburi'] text-muted-foreground leading-tight">
          THE GOAL:<br />
          NAME EVERY<br />
          WOMAN
        </h1>
        <div className="text-lg text-muted-foreground mb-2">
          A simple task for someone of my skillset
        </div>
        <div className="text-primary italic">
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <TableOfContents />
        </div>

        {/* MDX Content Area */}
        <div className="lg:col-span-3">
          <div className="prose prose-invert max-w-none">
            <MDXProvider components={components}>
              <AboutContent />
            </MDXProvider>
          </div>
        </div>
      </div>
    </div>
  );
} 
import type { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { TableOfContents } from './TableOfContents';
import { Note } from './ui/Note';
import AboutContent from '../content/about.mdx';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';

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

function AboutSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-24 w-3/4 mb-4 bg-muted" /> {/* Title */}
        <Skeleton className="h-6 w-1/2 mb-2 bg-muted" /> {/* Subtitle */}
        <Skeleton className="h-4 w-1/3 bg-muted" /> {/* Date */}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-2/3 bg-muted" /> {/* Section Title */}
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-4 bg-muted"
                  style={{ width: `${Math.random() * 20 + 80}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

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
      <div className="max-w-[120rem] mx-auto px-0 sm:px-4 py-8 flex justify-center flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,_1fr)_250px] gap-8 w-full px-2 sm:px-4">
          {/* Table of Contents - Left Column */}
          <motion.div
            className="hidden lg:block lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] overflow-visible px-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TableOfContents />
          </motion.div>

          {/* Main Content - Middle Column */}
          <motion.div
            className="min-w-0 w-full max-w-full lg:max-w-[1400px] mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header Title Area */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 font-['Chonburi'] text-[var(--about-text)] leading-tight text-glow">
                THE GOAL:<br />
                NAME EVERY<br />
                WOMAN
              </h1>
              <div className="text-lg text-[var(--about-text-muted)] mb-2 italic">
                A simple task for someone of my skillset
              </div>
              <div className="text-[var(--about-text-muted)] italic">
                Jan 1, 2025
              </div>
            </motion.div>

            {/* MDX Content Area */}
            <div className="prose prose-invert prose-lg max-w-none overflow-visible [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent [&_code]:whitespace-pre [&_pre]:overflow-x-auto prose-p:max-w-none prose-headings:max-w-none">
              <AnimatePresence mode="wait">
                <Suspense fallback={<AboutSkeleton />}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="overflow-visible"
                  >
                    <MDXProvider components={components}>
                      <AboutContent />
                    </MDXProvider>
                  </motion.div>
                </Suspense>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Notes Area - Right Column */}
          <motion.div
            className="hidden lg:block lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] overflow-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Notes will be positioned here by the Note component */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
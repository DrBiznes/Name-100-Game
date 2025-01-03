import { useEffect, useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Helmet } from 'react-helmet-async';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface CodeProps extends React.HTMLProps<HTMLElement> {
  inline?: boolean;
  node?: any;
}

export function About() {
  const [content, setContent] = useState('');
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load the markdown content
    fetch('/content/about.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        
        // Extract table of contents
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const extractedToc: TableOfContentsItem[] = [];
        let tocMatch;
        
        while ((tocMatch = headingRegex.exec(text)) !== null) {
          const id = tocMatch[2].toLowerCase().replace(/[^\w]+/g, '-');
          extractedToc.push({
            id,
            text: tocMatch[2],
            level: tocMatch[1].length
          });
        }
        
        setToc(extractedToc);

        // Set initial active section based on URL hash
        const hash = location.hash.replace('#/', '');
        if (hash && extractedToc.some(item => item.id === hash)) {
          setActiveSection(hash);
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else if (extractedToc.length > 0) {
          setActiveSection(extractedToc[0].id);
        }
      })
      .catch(err => console.error('Failed to load about content:', err));
  }, [location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      let current = '';

      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
        window.history.replaceState(null, '', `#/about#${current}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleTocClick = (itemId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(itemId);
      navigate(`/about#${itemId}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Name100Women - About</title>
        <meta 
          name="description" 
          content="Learn about Name100Women - The Official Name 100 Women Challenge. Discover our mission, technology stack, and future plans." 
        />
      </Helmet>

      <style>
        {`
          .footnote-ref {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 20px;
            border-radius: 12px;
            border: 2px solid var(--primary);
            background-color: transparent;
            color: var(--primary);
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            vertical-align: super;
            line-height: 1;
            text-decoration: none;
            margin: 0 2px;
          }
          .footnote-ref:hover {
            border-color: var(--accent);
            color: var(--accent);
            background-color: color-mix(in srgb, var(--accent) 10%, transparent);
          }
          .footnotes {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
          }
          .footnotes ol {
            list-style-type: decimal;
          }
          .footnotes li {
            font-size: 0.9rem;
            color: var(--muted-foreground);
          }
        `}
      </style>

      <motion.div 
        className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Table of Contents - Left Sidebar */}
        <Card className="hidden lg:block sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto border-0 shadow-none bg-transparent">
          <nav className="space-y-2 p-4">
            <h3 className="text-2xl font-bold mb-4 font-['Chonburi'] text-header text-glow leading-tight">
              Table of<br />Contents
            </h3>
            <Separator className="my-2" />
            <ul className="space-y-2 font-['Alegreya']">
              {toc.map((item) => (
                <li 
                  key={item.id}
                  style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                >
                  <a
                    href={`#/about#${item.id}`}
                    onClick={handleTocClick(item.id)}
                    className={`block py-1 px-2 rounded transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Card>

        {/* Main Content */}
        <Card className="prose prose-invert p-6 border-0 shadow-none bg-transparent font-['Alegreya'] w-full max-w-[800px]">
          {/* Title Area */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-['Chonburi'] text-muted-foreground text-glow leading-tight">
              THE GOAL:<br />
              NAME EVERY<br />
              WOMAN
            </h1>
            <div className="text-lg text-muted-foreground mb-2">
              A simple task for someone of my skillset
            </div>
            <div className="text-[var(--primary)] italic">
              Dec 4, 2024
            </div>
          </div>

          <div className="w-full">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [remarkRehype, { allowDangerousHtml: true }]
              ]}
              rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                rehypeAutolinkHeadings,
                rehypeHighlight,
                rehypeStringify
              ]}
              components={{
                a: ({ node, ...props }) => {
                  // Handle footnote references
                  if (props.href?.startsWith('#user-content-fn-')) {
                    const footnoteId = props.href.replace('#user-content-fn-', '');
                    const footnoteRef = document.getElementById(`user-content-fn-${footnoteId}`);
                    return (
                      <a
                        {...props}
                        className="footnote-ref"
                        onClick={(e) => {
                          e.preventDefault();
                          if (footnoteRef) {
                            footnoteRef.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {footnoteId}
                      </a>
                    );
                  }
                  // Handle normal links
                  return (
                    <a {...props} className="text-primary hover:text-accent transition-colors" />
                  );
                },
                
                section: ({ node, className, ...props }) => {
                  if (className?.includes('footnotes')) {
                    return (
                      <section {...props} className="footnotes">
                        <h2 className="text-2xl font-bold mb-4 font-['Chonburi'] text-header text-glow">Notes</h2>
                        {props.children}
                      </section>
                    );
                  }
                  return <section {...props} />;
                },
                
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-4xl font-bold mb-8 font-['Chonburi'] text-muted-foreground text-glow" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-3xl font-bold mt-12 mb-6 font-['Chonburi'] text-muted-foreground text-glow flex items-center gap-2">
                    <span className="material-icons text-muted-foreground">{props.id === 'introduction' ? 'waving_hand' : 
                      props.id === 'how-it-started' ? 'history_edu' :
                      props.id === 'the-technology' ? 'code' :
                      props.id === 'community-impact' ? 'diversity_3' :
                      props.id === 'future-plans' ? 'rocket_launch' :
                      props.id === 'get-involved' ? 'group_add' :
                      props.id === 'contact' ? 'contact_mail' : 'article'}</span>
                    {props.children}
                  </h2>
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-2xl font-bold mt-8 mb-4 font-['Chonburi'] text-muted-foreground" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 leading-relaxed text-muted-foreground" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-6 mb-4 text-muted-foreground" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-2" />
                ),
                
                // Add custom footnote handling
                sup: ({ node, ...props }) => {
                  if (props.className === 'footnote-ref') {
                    const id = (props as any)['data-reference'] || props.id;
                    return (
                      <a
                        href={`#fn-${id}`}
                        className="footnote-ref"
                        onClick={(e) => {
                          e.preventDefault();
                          const footnote = document.getElementById(`fn-${id}`);
                          if (footnote) {
                            footnote.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {id}
                      </a>
                    );
                  }
                  return <sup {...props} />;
                },

                // Add custom details/summary handling
                details: ({ node, ...props }) => (
                  <details
                    className="my-4 p-4 rounded-lg bg-muted hover:bg-card transition-colors cursor-pointer"
                    {...props}
                  />
                ),
                
                summary: ({ node, ...props }) => (
                  <summary
                    className="font-bold text-lg text-primary cursor-pointer"
                    {...props}
                  />
                ),

                // Enhanced code block handling
                code: ({ node, inline, className, children, ...props }: CodeProps) => {
                  if (inline) {
                    return <code className={className} {...props}>{children}</code>;
                  }

                  const title = (node as any)?.data?.meta || '';
                  const match = /language-(\w+)/.exec(className || '');
                  const lang = match ? match[1] : '';

                  return (
                    <div className="my-4">
                      {title && (
                        <div className="flex items-center gap-2 text-muted-foreground mb-2 font-['Alegreya']">
                          <span className="material-icons text-base">code</span>
                          <span className="text-sm">{title}</span>
                          {lang && <span className="text-xs opacity-50">({lang})</span>}
                        </div>
                      )}
                      <div className="relative rounded-lg bg-muted w-full">
                        <div className="overflow-x-auto">
                          <pre className={`${className} p-4 m-0 w-full`}>
                            <code {...props} className={`${className} whitespace-pre`}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </Card>

        {/* Footnotes - Right Sidebar */}
        <Card className="hidden lg:block sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto border-0 shadow-none bg-transparent">
          <nav className="space-y-2 p-4">
            <h3 className="text-2xl font-bold mb-4 font-['Chonburi'] text-header text-glow leading-tight flex items-center gap-2">
              <span className="material-icons">note_alt</span>
              Notes
            </h3>
            <Separator className="my-2" />
            <div className="space-y-4 font-['Alegreya']">
              {Array.from({ length: 10 }).map((_, index) => {
                const footnoteId = `user-content-fn-${index + 1}`;
                const footnote = document.getElementById(footnoteId);
                if (!footnote) return null;
                
                return (
                  <div 
                    key={footnoteId}
                    className="p-3 rounded transition-colors bg-muted hover:bg-card"
                  >
                    <div className="flex items-start gap-2">
                      <span className="footnote-ref-mini">{index + 1}</span>
                      <div className="text-sm text-muted-foreground">
                        {footnote?.textContent}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
        </Card>
      </motion.div>
    </>
  );
} 
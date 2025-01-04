import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  title?: string;
  language?: string;
  children: string;
  collapsed?: boolean;
}

export function CodeBlock({ 
  title = 'Code Example', 
  language = 'typescript', 
  children,
  collapsed = true 
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  // Clean up the code by removing any trailing newline
  const code = children.trim();

  return (
    <div className="my-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group bg-transparent border-0 p-0 shadow-none hover:bg-transparent hover:shadow-none"
      >
        <span className="material-symbols-outlined transition-all group-hover:text-glow">
          {isExpanded ? 'visibility_off' : 'visibility'}
        </span>
        <span className="italic">{title}</span>
        {language && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
            {language}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Highlight
                theme={themes.nightOwl}
                code={code}
                language={language}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`overflow-x-auto m-0 ${className}`} style={style}>
                    <div className="py-4 px-4">
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })} className="table-row">
                          <span className="table-cell">
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </pre>
                )}
              </Highlight>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
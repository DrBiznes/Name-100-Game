import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';
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
  collapsed = false 
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  // Clean up the code by removing any trailing newline
  const code = children.trim();

  return (
    <div className="my-4 rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Code2 className="w-4 h-4" />
          <span>{title}</span>
          {language && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
              {language}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Highlight
              theme={themes.nightOwl}
              code={code}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className="p-4 overflow-x-auto m-0" style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })} className="table-row">
                      <span className="table-cell text-muted-foreground pr-4 text-right select-none w-[2.5rem] text-sm">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="table-cell">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
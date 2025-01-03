import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  title?: string;
  language?: string;
  children: string;
}

export function CodeBlock({ title = 'Code Example', language = 'typescript', children }: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              code={children.trim()}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className="p-4 overflow-x-auto m-0" style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="text-muted-foreground mr-4 select-none">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
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
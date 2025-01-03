import React, { useEffect, useState } from 'react';

interface Section {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Find all heading elements in the content
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .filter(heading => heading.closest('.prose')); // Only get headings within our content area

    const sectionData = headings.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));

    setSections(sectionData);

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
      }
    );

    // Observe all section headings
    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-8 bg-card p-4 rounded-lg shadow-lg border border-border overflow-y-auto max-h-[calc(100vh-200px)] mb-8">
      <h4 className="text-lg font-bold mb-4 text-header">Table of Contents</h4>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li
            key={section.id}
            style={{
              paddingLeft: `${(section.level - 1) * 1}rem`,
            }}
          >
            <a
              href={`#${section.id}`}
              className={`block py-1 px-2 rounded transition-colors hover:bg-muted ${
                activeSection === section.id
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              {section.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 
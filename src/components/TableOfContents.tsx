import React, { useEffect } from 'react';
import { Separator } from './ui/separator';
import { useLocation, useNavigate } from 'react-router-dom';

export function TableOfContents() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const sections = [
    { id: 'name-every-woman', text: 'NAME EVERY WOMAN' },
    { 
      id: 'the-challenges', 
      text: 'The Challenges',
      subsections: [
        { id: 'challenge-1-verification-vanessa', text: 'Challenge 1' },
        { id: 'challenge-2-wiki-winona', text: 'Challenge 2' },
        { id: 'challenge-3-mononym-mary', text: 'Challenge 3' }
      ]
    },
    { id: 'missing-mononyms', text: 'Missing Mononyms' },
    { 
      id: 'tech-stack', 
      text: 'Tech Stack',
      subsections: [
        { id: 'frontend', text: 'Frontend' },
        { id: 'backend', text: 'Backend' }
      ]
    },
    { id: 'wrap-up', text: 'Wrap Up' },
  ];

  // Handle initial section scroll on mount and hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const yOffset = -20;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Special case for the top entry to scroll to top of page
    if (sectionId === 'name-every-woman') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/about');
      return;
    }

    navigate(`/about#${sectionId}`);

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-8">
      <h4 className="text-4xl font-bold font-['Chonburi'] text-[#E8A0AB] text-glow mb-4">
        Table Of<br />Contents
      </h4>
      <Separator className="mb-6" />
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={section.id === 'name-every-woman' ? '#' : `#${section.id}`}
              className="block font-['Alegreya'] text-xl font-medium text-foreground hover:text-primary transition-colors"
              onClick={handleSectionClick(section.id)}
            >
              {section.text}
            </a>
            {section.subsections && (
              <ul className="ml-6 mt-3 space-y-3">
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <a
                      href={`#${subsection.id}`}
                      className="block font-['Alegreya'] text-lg text-muted-foreground hover:text-primary transition-colors"
                      onClick={handleSectionClick(subsection.id)}
                    >
                      {subsection.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
} 
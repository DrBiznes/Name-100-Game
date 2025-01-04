import React, { useEffect } from 'react';
import { Separator } from './ui/separator';
import { useLocation, useNavigate } from 'react-router-dom';

export function TableOfContents() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const sections = [
    { id: 'about-name100women', text: 'About' },
    { id: 'the-challenge', text: 'The Challenge' },
    { id: 'why-this-matters', text: 'Why This Matters' },
    { id: 'how-it-works', text: 'How It Works' },
    { id: 'scoring-system', text: 'Scoring System' },
    { id: 'technical-implementation', text: 'Technical Implementation' },
    { id: 'future-plans', text: 'Future Plans' },
    { id: 'contributing', text: 'Contributing' },
    { id: 'contact', text: 'Contact' },
    { id: 'acknowledgments', text: 'Acknowledgments' },
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
      <ul className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block font-['Alegreya'] text-base text-foreground hover:text-primary transition-colors"
              onClick={handleSectionClick(section.id)}
            >
              {section.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Separator } from './ui/separator';

export function NavMenu() {
  const location = useLocation();

  const navItems = [
    { label: 'Game', path: '/' },
    { label: 'Recent Scores', path: '/scores' },
    { label: 'Stats', path: '/stats' },
    { label: 'About', path: '/about' }
  ];

  return (
    <div className="text-center">
      <Separator className="my-1 w-[90%] md:w-[70%] lg:w-[600px] mx-auto" />
      <div className="flex items-center justify-center space-x-2 text-base md:text-lg">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              to={item.path}
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === item.path ? 'font-medium text-primary' : ''
              }`}
            >
              {item.label}
            </Link>
            {index < navItems.length - 1 && (
              <Separator orientation="vertical" className="h-4" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 
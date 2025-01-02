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
      <Separator className="my-1 bg-gray-400 w-[90%] md:w-[70%] lg:w-[600px] mx-auto" />
      <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              to={item.path}
              className={`text-gray-600 hover:text-gray-900 ${
                location.pathname === item.path ? 'font-medium' : ''
              }`}
            >
              {item.label}
            </Link>
            {index < navItems.length - 1 && (
              <Separator orientation="vertical" className="h-4 bg-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 
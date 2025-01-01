import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { WomenNameGame } from './components/WomenNameGame';
import { Leaderboard } from './components/Leaderboard';
import { Rules } from './components/Rules';
import { FloatingTimer } from './components/FloatingTimer';
import { useRef, useState } from 'react';
import { Toaster } from "sonner";
import { UserHistory } from './components/UserHistory';
import { ScoreView } from './components/ScoreView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavMenu } from './components/NavMenu';
import { RecentScores } from './components/RecentScores';
import { Stats } from './components/Stats';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const [gameState, setGameState] = useState({
    isActive: false,
    elapsedTime: 0
  });
  const timerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const showLeaderboard = location.pathname !== '/stats';

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen w-full bg-white text-black flex flex-col">
        <header className="w-full text-center p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold">NAME 100 WOMEN CHALLENGE</h1>
            <NavMenu />
          </div>
        </header>
        <main className="container flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Routes>
              <Route path="/" element={
                <>
                  <div className="lg:col-span-1">
                    <Rules />
                  </div>
                  <div className="lg:col-span-1">
                    <WomenNameGame 
                      onGameStateChange={setGameState} 
                      timerRef={timerRef}
                    />
                  </div>
                </>
              } />
              <Route path="/scores/:id" element={
                <>
                  <div className="lg:col-span-1">
                    <UserHistory />
                  </div>
                  <div className="lg:col-span-1">
                    <ScoreView />
                  </div>
                </>
              } />
              <Route path="/scores" element={
                <>
                  <div className="lg:col-span-1">
                    <Rules />
                  </div>
                  <div className="lg:col-span-1">
                    <RecentScores />
                  </div>
                </>
              } />
              <Route path="/stats" element={<Stats />} />
              <Route path="/about" element={
                <div className="lg:col-span-2">
                  <h2>About Page Coming Soon</h2>
                </div>
              } />
            </Routes>
            {showLeaderboard && (
              <div className="lg:col-span-1">
                <Leaderboard />
              </div>
            )}
          </div>
        </main>
        <footer className="mt-auto py-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Built With</h3>
              <ul className="space-y-2 mb-6 list-none p-0 m-0">
                <li>
                  <a 
                    href="https://ui.shadcn.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    shadcn/ui
                  </a>
                </li>
                <li>
                  <a 
                    href="https://fonts.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Google Fonts
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.npmjs.com/package/react-confetti-explosion" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    react-confetti-explosion
                  </a>
                </li>
              </ul>
              <div className="text-gray-600 text-sm">
                © {new Date().getFullYear()}{' '}
                <a 
                  href="https://www.jamino.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Jamino
                </a>
                . Released under the{' '}
                <a 
                  href="https://opensource.org/licenses/MIT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 underline"
                >
                  MIT License
                </a>
              </div>
            </div>
          </div>
        </footer>
        <FloatingTimer 
          elapsedTime={gameState.elapsedTime}
          isGameActive={gameState.isActive}
          timerRef={timerRef}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;

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
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
      <Helmet>
        <title>Name100Women - Home of the Official Name 100 Women Challenge</title>
        <meta name="description" content="Name100Women - The Official Name 100 Women Challenge" />
        <link rel="icon" type="image/png" href="./name100.png" />
      </Helmet>
      <Toaster 
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          },
          classNames: {
            success: "bg-[#2D4B3B] border-[#4CAF50] border",
            error: "bg-[#4B2D2D] border-[#FF8674] border",
            warning: "bg-[#4B3D2D] border-[#FFA726] border",
          }
        }}
      />
      <div className="min-h-screen w-full text-black flex flex-col">
        <header className="w-full text-center p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-glow">NAME 100 WOMEN CHALLENGE</h1>
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
              <div className="lg:col-span-1 h-full">
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
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    shadcn/ui
                  </a>
                </li>
                <li>
                  <a 
                    href="https://fonts.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Google Fonts
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.npmjs.com/package/react-confetti-explosion" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    react-confetti-explosion
                  </a>
                </li>
              </ul>
              <div className="text-foreground text-sm">
                © {new Date().getFullYear()}{' '}
                <a 
                  href="https://www.jamino.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Jamino
                </a>
                . Released under the{' '}
                <a 
                  href="https://opensource.org/licenses/MIT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors underline"
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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

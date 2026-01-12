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
import { About } from './components/About';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

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

  const showLeaderboard = location.pathname !== '/stats' && location.pathname !== '/about';

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
            <h1 className="text-2xl md:text-4xl font-bold text-glow flex items-center justify-center gap-4">
              <span className="material-icons text-header text-2xl md:text-4xl">female</span>
              NAME 100 WOMEN CHALLENGE
              <span className="material-icons text-header text-2xl md:text-4xl">female</span>
            </h1>
            <NavMenu />
          </div>
        </header>
        <main className={location.pathname === '/about' ? 'w-full' : 'container flex-grow'}>
          {location.pathname === '/about' ? (
            <Routes>
              <Route path="/about" element={<About />} />
            </Routes>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px] mb-6">
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
              </Routes>
              {showLeaderboard && (
                <div className="lg:col-span-1 h-full">
                  <Leaderboard />
                </div>
              )}
            </div>
          )}
        </main>
        <motion.footer
          layout
          className="w-full py-16 flex flex-col items-center gap-4 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-lg font-['Alegreya'] italic font-medium text-[var(--header)] text-glow">
            Thanks for playing!!!!
          </div>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/DrBiznes/Name-100-Game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
              aria-label="GitHub Repository"
            >
              <svg
                height="24"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="24"
                fill="currentColor"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
                }}
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </a>
            <a
              href="https://twitter.com/drbiznez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
              aria-label="Twitter Profile"
            >
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
                }}
              >
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </a>
            <a
              href="https://jamino.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
              aria-label="Personal Website"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '1.5rem',
                  fontVariationSettings: "'FILL' 1",
                  filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
                }}
              >
                language
              </span>
            </a>
            <a
              href="mailto:contact@jamino.me"
              className="text-[var(--header)] hover:text-[var(--about-text-bright)] transition-colors"
              aria-label="Email Contact"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '1.5rem',
                  fontVariationSettings: "'FILL' 1",
                  filter: 'drop-shadow(0 0 10px rgba(232, 160, 171, 0.3)) drop-shadow(0 0 20px rgba(232, 160, 171, 0.2)) drop-shadow(0 0 30px rgba(232, 160, 171, 0.1))'
                }}
              >
                mail
              </span>
            </a>
          </div>
          <div className="mt-4 text-[var(--header)] text-sm font-['Alegreya'] italic opacity-80">
            © {new Date().getFullYear()} Jamino • Released under the MIT License
          </div>
        </motion.footer>
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
    <ConvexProvider client={convex}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ConvexProvider>
  );
}

export default App;

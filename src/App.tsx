import { WomenNameGame } from './components/WomenNameGame';
import { Leaderboard } from './components/Leaderboard';
import { Rules } from './components/Rules';
import { FloatingTimer } from './components/FloatingTimer';
import { useRef, useState } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    isActive: false,
    elapsedTime: 0
  });
  const timerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen w-full bg-white text-black flex flex-col">
      <header className="w-full text-center p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">NAME 100 WOMEN CHALLENGE</h1>
          <p className="text-sm md:text-base">Test your knowledge: Can you name 100 women?</p>
        </div>
      </header>
      <main className="container flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Rules />
          </div>
          <div className="lg:col-span-1">
            <WomenNameGame 
              onGameStateChange={setGameState} 
              timerRef={timerRef}
            />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
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
  );
}

export default App;

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
    <div className="min-h-screen w-full bg-white text-black">
      <header className="w-full text-center p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">NAME 100 WOMEN CHALLENGE</h1>
          <p className="text-sm md:text-base">Test your knowledge: Can you name 100 women?</p>
        </div>
      </header>
      <main className="container">
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
      <FloatingTimer 
        elapsedTime={gameState.elapsedTime}
        isGameActive={gameState.isActive}
        timerRef={timerRef}
      />
    </div>
  );
}

export default App;

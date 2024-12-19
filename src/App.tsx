import { WomenNameGame } from './components/WomenNameGame';
import { Leaderboard } from './components/Leaderboard';
import { Rules } from './components/Rules';

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="text-center p-4 bg-gray-100 border-b border-gray-300">
        <h1 className="text-4xl font-bold">👩 The Women Name Game</h1>
        <p>Test your knowledge: Can you name 100 women?</p>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-[250px_1fr_250px] gap-4">
          <div className="p-4">
            <Leaderboard />
          </div>
          
          <div>
            <WomenNameGame />
          </div>
          
          <div className="p-4">
            <Rules />
          </div>
        </div>
      </main>

      <footer className="text-center p-4 bg-gray-100 border-t border-gray-300 mt-8">
        <p>© 2024 Women Name Game - A fun way to celebrate women's achievements</p>
      </footer>
    </div>
  );
}

export default App;

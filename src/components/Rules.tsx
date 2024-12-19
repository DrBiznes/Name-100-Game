import '../App.css';

export function Rules() {
  return (
    <div className="text-lg pt-6 font-comic">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-4 font-comic">
        <span className="material-icons">description</span>
        Rules
      </h2>
      <ol>
        <li>Name as many women as you can</li>
        <li>Each name must be unique</li>
        <li>Names are verified through Wikipedia</li>
        <li>You have unlimited time</li>
        <li>Goal is to reach 100 names</li>
        <li>Faster times get higher rankings</li>
      </ol>
      
      <h3 className="text-xl font-bold mt-6 mb-4 font-comic">Tips:</h3>
      <ul>
        <li>Think of historical figures</li>
        <li>Include actresses and artists</li>
        <li>Remember political leaders</li>
        <li>Consider scientists and inventors</li>
      </ul>
    </div>
  );
} 
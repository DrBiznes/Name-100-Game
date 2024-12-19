import { Trophy } from 'lucide-react';

export function Leaderboard() {
  const placeholderScores = [
    { name: "Jane Doe", score: "1:45", date: "2024-03-15" },
    { name: "Mary Smith", score: "2:12", date: "2024-03-14" },
    { name: "Sarah Johnson", score: "2:30", date: "2024-03-13" },
    { name: "Emma Wilson", score: "2:45", date: "2024-03-12" },
    { name: "Lisa Brown", score: "3:00", date: "2024-03-11" },
  ];

  return (
    <div className="text-lg">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <Trophy className="w-6 h-6" />
        Leaderboard
      </h2>
      <table cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {placeholderScores.map((score, index) => (
            <tr key={index}>
              <td>{score.name}</td>
              <td>{score.score}</td>
              <td>{score.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
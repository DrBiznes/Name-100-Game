import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { NameInput } from './NameInput';
import { formatTime } from '@/lib/utils';

interface ScoreData {
  id: number;
  username: string;
  score: number;
  submission_date: string;
  completed_names: string[];
  name_count: number;
  username_color: string;
}

export function ScoreView() {
  const { id } = useParams();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScore() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/scores/${id}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch score');
        }
        
        setScoreData(data.score);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load score');
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!scoreData) return <div>Score not found</div>;

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center">
          I Named {scoreData.name_count} in{' '}
          <span className="font-mono">{formatTime(scoreData.score)}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {scoreData.completed_names.map((name, index) => (
          <NameInput
            key={index}
            input={{
              index,
              value: name,
              status: 'valid'
            }}
            index={index}
            isGameActive={false}
            inputRef={() => {}}
            onInputChange={() => {}}
            onKeyDown={() => {}}
          />
        ))}
      </div>
    </Card>
  );
} 
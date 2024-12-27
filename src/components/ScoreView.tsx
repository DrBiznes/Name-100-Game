import { useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { NameInput } from './NameInput';
import { formatTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi } from '@/services/api';

export function ScoreView() {
  const { id } = useParams();
  
  const { data: userData, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.userHistory(id || ''),
    queryFn: () => leaderboardApi.getUserHistory(id || ''),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Failed to load score'}</div>;
  if (!userData?.score) return <div>Score not found</div>;

  const handleInputChange = () => {};
  const handleKeyDown = () => {};

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center">
          I Named {userData.score.name_count} in{' '}
          <span className="font-mono">{formatTime(userData.score.score)}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {userData.score.completed_names.map((name, index) => (
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
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </Card>
  );
} 
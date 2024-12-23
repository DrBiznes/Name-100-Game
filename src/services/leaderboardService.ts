import { API_URL } from '../config';

interface SubmitScorePayload {
  username: string;
  completion_time: number;
  completed_names: string[];
  game_mode: string;
}

export const submitScore = async (payload: SubmitScorePayload) => {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit score');
  }

  return response.json();
}; 
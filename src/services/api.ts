import { API_URL } from '@/config';

export interface LeaderboardEntry {
  id: string;
  username: string;
  username_color: string;
  score: number;
  submission_date: string;
  name_count: number;
}

export interface ScoreSubmission {
  username: string;
  completion_time: number;
  completed_names: string[];
  game_mode: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const leaderboardApi = {
  async getLeaderboard(gameMode: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${API_URL}/leaderboard/${gameMode}`, {
        headers: defaultHeaders,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
      
      return data.leaderboard;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching leaderboard');
    }
  },

  async submitScore(score: ScoreSubmission): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          ...score,
          username: score.username.toUpperCase(),
          completed_names: score.completed_names,
          game_mode: score.game_mode.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit score');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while submitting score');
    }
  }
}; 
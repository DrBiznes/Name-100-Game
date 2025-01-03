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
  cf_turnstile_response: string;
}

export interface ScoreHistoryEntry {
  id: number;
  username: string;
  score: number;
  submission_date: string;
  name_count: number;
  username_color: string;
}

export interface ScoreData {
  id: string;
  username: string;
  username_color: string;
  score: number;
  submission_date: string;
  name_count: number;
  completed_names: string[];
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const QUERY_KEYS = {
  leaderboard: (gameMode: string) => ['leaderboard', gameMode],
  userHistory: (id: string) => ['userHistory', id],
  recentScores: (gameMode: string) => ['recentScores', gameMode] as const,
  stats: (gameMode: string) => ['stats', gameMode] as const,
};

interface ScoreSubmissionResponse {
  success: boolean;
  score: {
    id: number;
    username: string;
    score: number;
    completed_names: string[];
    name_count: number;
    username_color: string;
  };
  error?: string;
}

interface LeaderboardApiResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  cacheTimestamp: string;
  cacheExpiresIn: number;
}

export const leaderboardApi = {
  async getLeaderboard(gameMode: string): Promise<LeaderboardApiResponse> {
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
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching leaderboard');
    }
  },

  async getUserHistory(id: string): Promise<{
    history: ScoreHistoryEntry[];
    score: ScoreData;
    total: number;
  }> {
    const response = await fetch(
      `${API_URL}/scores/${id}?include_history=true&history_limit=100`
    );
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch history');
    }

    return {
      history: data.history,
      score: data.score,
      total: data.history.length,
    };
  },

  async submitScore(score: ScoreSubmission): Promise<number> {
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
        
        if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid submission data');
        }
        if (response.status === 504) {
          throw new Error('Request timed out - please try again');
        }
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json() as ScoreSubmissionResponse;
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit score');
      }

      return data.score.id;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while submitting score');
    }
  }
};

export const recentScoresApi = {
  getRecentScores: async (gameMode: string): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_URL}/recent/${gameMode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent scores');
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch recent scores');
    }
    return data.scores;
  },
};

export interface NameStats {
  name: string;
  count: number;
  variants: string[];
}

export interface StatsResponse {
  success: boolean;
  stats: NameStats[];
  gameMode: number | null;
  totalNames: number;
  totalOccurrences: number;
  cacheTimestamp: string;
  cacheExpiresIn: number;
}

export const statsApi = {
  getStats: async (gameMode?: string): Promise<StatsResponse> => {
    const response = await fetch(`${API_URL}/stats${gameMode && gameMode !== 'all' ? `?gameMode=${gameMode}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch stats');
    }
    return data;
  },
}; 
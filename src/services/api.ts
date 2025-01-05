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
  completed_names?: string[];
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

export interface UserHistoryResponse {
  success: boolean;
  score: ScoreData;
  history: ScoreHistoryEntry[];
  total: number;
  scores: { [key: string]: ScoreData };
}

export interface LeaderboardApiResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  cacheTimestamp: string;
  cacheExpiresIn: number;
}

export interface RecentScoresResponse {
  success: boolean;
  scores: LeaderboardEntry[];
  limit: number;
  total: number;
}

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

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const QUERY_KEYS = {
  leaderboard: (gameMode: string) => ['leaderboard', gameMode],
  userHistory: (id: string) => ['userHistory', id],
  userScore: (id: string) => ['userScore', id],
  recentScores: (gameMode: string) => ['recentScores', gameMode] as const,
  stats: (gameMode: string) => ['stats', gameMode] as const,
};

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

  async getUserHistory(id: string, includeHistory: boolean = true, historyLimit: number = 100): Promise<UserHistoryResponse> {
    const response = await fetch(
      `${API_URL}/scores/${id}?include_history=${includeHistory}&history_limit=${historyLimit}`
    );
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch history');
    }

    // Create a map of all scores for quick lookup
    const scores = {
      [data.score.id]: data.score,
      ...data.history.reduce((acc: { [key: string]: ScoreData }, entry: ScoreHistoryEntry) => {
        acc[entry.id] = {
          id: entry.id.toString(),
          username: entry.username,
          username_color: entry.username_color,
          score: entry.score,
          submission_date: entry.submission_date,
          name_count: entry.name_count,
          completed_names: entry.completed_names || [], // Handle completed_names if present in history
        };
        return acc;
      }, {}),
    };

    return {
      success: data.success,
      score: data.score,
      history: data.history,
      total: data.history.length,
      scores,
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
          game_mode: score.game_mode,
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

      const data = await response.json();
      
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
  getRecentScores: async (gameMode: string, limit: number = 25): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_URL}/recent/${gameMode}?limit=${limit}`);
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
# Name 100 Women Challenge

The 100 Women Name Challenge is an interactive web game that tests players' knowledge of influential women throughout history. Players race against time to name women from various fields including history, entertainment, science, politics, and more. The game offers multiple difficulty levels where players can attempt to name 20, 50, or 100 women.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run deploy       # Deploy to production
```

## Technical Architecture

### Name Validation System

The game employs a sophisticated two-tier validation system for checking player-submitted names:

1. **Local Database Check**: First, names are checked against a curated database of over 2,000 notable women. This database includes historical figures, entertainers, politicians, and scientists, providing instant validation without API calls.

2. **Wikipedia API Validation**: If a name isn't found in the local database, the game performs a real-time check using the Wikipedia API. This process involves:
   - Searching for the exact name match
   - Analyzing the article's content for gender indicators
   - Verifying the subject is a person (not a fictional character or other entity)
   - Special handling for mononyms (single-name artists/performers)
   
This hybrid approach ensures both speed and comprehensiveness, allowing players to enter names of notable women even if they're not in our local database.

### Cloudflare Stack

The application runs entirely on Cloudflare's edge infrastructure:

#### Hono Worker Backend
The backend is built using Hono, a lightweight framework for Cloudflare Workers. It handles:
- Score submission and validation
- Leaderboard management
- Request/response caching
- CORS and security middleware

#### Database Architecture
- **D1 Database**: SQLite-compatible database running on the edge, storing:
  - Player scores
  - Completion times
  - Name submissions
  - User identifiers

- **KV Storage**: Used for caching frequently accessed data:
  - Leaderboard rankings
  - Recent submissions
  - API response caching

This serverless architecture provides several benefits:
- Near-instant response times through edge computing
- Automatic scaling without server management
- Built-in DDoS protection through Cloudflare's network
- Global data replication for consistent performance

### Frontend Tech

Built with React 18, TypeScript, and Vite, featuring:
- Real-time name validation feedback
- Wikipedia article previews for validated names
- Interactive leaderboard updates
- Progress tracking and timing system

## License

Released under the MIT License. See `LICENSE` for more information.

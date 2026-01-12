import { v } from "convex/values";
import { query } from "./_generated/server";
import { isValidGameMode } from "./lib/helpers";

/**
 * Get leaderboard for a specific game mode
 */
export const getLeaderboard = query({
    args: {
        gameMode: v.number(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!isValidGameMode(args.gameMode)) {
            throw new Error("Invalid game mode. Must be 20, 50, or 100");
        }

        const limit = args.limit ?? 100;

        // Get scores ordered by time (ascending = fastest first)
        const scores = await ctx.db
            .query("scores")
            .withIndex("by_nameCount_score", (q) => q.eq("nameCount", args.gameMode))
            .order("asc")
            .take(limit);

        return scores.map((score) => ({
            id: score._id,
            username: score.username,
            usernameColor: score.usernameColor,
            score: score.score,
            submissionDate: score.submissionDate,
            nameCount: score.nameCount,
        }));
    },
});

/**
 * Get leaderboard for multiple game modes
 */
export const getMultipleLeaderboards = query({
    args: {
        gameModes: v.array(v.number()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;
        const results: Record<
            number,
            Array<{
                id: string;
                username: string;
                usernameColor: string;
                score: number;
                submissionDate: number;
                nameCount: number;
            }>
        > = {};

        for (const gameMode of args.gameModes) {
            if (!isValidGameMode(gameMode)) {
                throw new Error(`Invalid game mode: ${gameMode}. Must be 20, 50, or 100`);
            }

            const scores = await ctx.db
                .query("scores")
                .withIndex("by_nameCount_score", (q) => q.eq("nameCount", gameMode))
                .order("asc")
                .take(limit);

            results[gameMode] = scores.map((score) => ({
                id: score._id,
                username: score.username,
                usernameColor: score.usernameColor,
                score: score.score,
                submissionDate: score.submissionDate,
                nameCount: score.nameCount,
            }));
        }

        return results;
    },
});

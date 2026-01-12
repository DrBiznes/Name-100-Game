import { v } from "convex/values";
import { query } from "./_generated/server";
import { isValidGameMode } from "./lib/helpers";

/**
 * Get recent scores for a specific game mode
 */
export const getRecent = query({
    args: {
        gameMode: v.number(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!isValidGameMode(args.gameMode)) {
            throw new Error("Invalid game mode. Must be 20, 50, or 100");
        }

        const limit = Math.min(args.limit ?? 25, 100);

        // Get recent scores ordered by submission date (descending = newest first)
        const scores = await ctx.db
            .query("scores")
            .withIndex("by_nameCount", (q) => q.eq("nameCount", args.gameMode))
            .order("desc")
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

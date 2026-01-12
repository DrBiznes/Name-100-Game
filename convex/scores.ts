import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateColor, isValidUsername, isValidGameMode } from "./lib/helpers";

/**
 * Submit a new score to the leaderboard
 */
export const submitScore = mutation({
    args: {
        username: v.string(),
        completionTime: v.number(),
        completedNames: v.array(v.string()),
        gameMode: v.number(),
        fingerprint: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate username
        if (!isValidUsername(args.username)) {
            throw new Error(
                "Username must be 3 characters using letters and special characters (!$?&()#@+=/)"
            );
        }

        // Validate game mode
        if (!isValidGameMode(args.gameMode)) {
            throw new Error("Invalid game mode. Must be 20, 50, or 100");
        }

        // Validate completed names count matches game mode
        if (args.completedNames.length !== args.gameMode) {
            throw new Error(
                `Game mode ${args.gameMode} requires exactly ${args.gameMode} names`
            );
        }

        // Generate user identifier and color
        const userIdentifier = args.fingerprint;
        const usernameColor = generateColor(args.fingerprint, args.username.toUpperCase());

        // Check for duplicate submission (same names within 2 minutes)
        const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
        const recentScores = await ctx.db
            .query("scores")
            .withIndex("by_userIdentifier", (q) => q.eq("userIdentifier", userIdentifier))
            .filter((q) =>
                q.and(
                    q.eq(q.field("nameCount"), args.gameMode),
                    q.gt(q.field("submissionDate"), twoMinutesAgo)
                )
            )
            .collect();

        for (const score of recentScores) {
            const previousNames = new Set(score.completedNames);
            if (args.completedNames.every((name) => previousNames.has(name))) {
                throw new Error("This score has already been submitted");
            }
        }

        // Insert the score
        const scoreId = await ctx.db.insert("scores", {
            username: args.username.toUpperCase(),
            score: args.completionTime,
            completedNames: args.completedNames,
            nameCount: args.gameMode,
            submissionDate: Date.now(),
            userIdentifier,
            usernameColor,
        });

        // Update or create user record
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_fingerprintHash", (q) => q.eq("fingerprintHash", args.fingerprint))
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, { lastSeenAt: Date.now() });
        } else {
            await ctx.db.insert("users", {
                fingerprintHash: args.fingerprint,
                createdAt: Date.now(),
                lastSeenAt: Date.now(),
            });
        }

        return scoreId;
    },
});

/**
 * Get a score by its ID
 */
export const getById = query({
    args: { id: v.id("scores") },
    handler: async (ctx, args) => {
        const score = await ctx.db.get(args.id);
        if (!score) {
            return null;
        }
        return {
            id: score._id,
            username: score.username,
            usernameColor: score.usernameColor,
            score: score.score,
            submissionDate: score.submissionDate,
            nameCount: score.nameCount,
            completedNames: score.completedNames,
            userIdentifier: score.userIdentifier,
        };
    },
});

/**
 * Get user history by score ID (finds all scores by the same user)
 */
export const getUserHistory = query({
    args: {
        scoreId: v.id("scores"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const score = await ctx.db.get(args.scoreId);
        if (!score) {
            return null;
        }

        const limit = args.limit ?? 100;

        // Get all scores by this user
        const history = await ctx.db
            .query("scores")
            .withIndex("by_userIdentifier", (q) =>
                q.eq("userIdentifier", score.userIdentifier)
            )
            .order("desc")
            .take(limit);

        return {
            score: {
                id: score._id,
                username: score.username,
                usernameColor: score.usernameColor,
                score: score.score,
                submissionDate: score.submissionDate,
                nameCount: score.nameCount,
                completedNames: score.completedNames,
            },
            history: history.map((s) => ({
                id: s._id,
                username: s.username,
                usernameColor: s.usernameColor,
                score: s.score,
                submissionDate: s.submissionDate,
                nameCount: s.nameCount,
                completedNames: s.completedNames,
            })),
        };
    },
});

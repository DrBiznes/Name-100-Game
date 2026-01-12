import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get or create a user by fingerprint
 */
export const getOrCreateUser = mutation({
    args: {
        fingerprintHash: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_fingerprintHash", (q) =>
                q.eq("fingerprintHash", args.fingerprintHash)
            )
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, { lastSeenAt: Date.now() });
            return existingUser._id;
        }

        const userId = await ctx.db.insert("users", {
            fingerprintHash: args.fingerprintHash,
            createdAt: Date.now(),
            lastSeenAt: Date.now(),
        });

        return userId;
    },
});

/**
 * Get user by fingerprint
 */
export const getByFingerprint = query({
    args: {
        fingerprintHash: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_fingerprintHash", (q) =>
                q.eq("fingerprintHash", args.fingerprintHash)
            )
            .first();
    },
});

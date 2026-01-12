import { v } from "convex/values";
import { query } from "./_generated/server";
import { normalizeNameForComparison, isValidGameMode } from "./lib/helpers";

interface NameStat {
    name: string;
    count: number;
    variants: string[];
}

/**
 * Get name frequency statistics
 */
export const getStats = query({
    args: {
        gameMode: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Validate game mode if provided
        if (args.gameMode !== undefined && !isValidGameMode(args.gameMode)) {
            throw new Error("Invalid game mode. Must be 20, 50, or 100");
        }

        // Get scores filtered by game mode if provided, otherwise get all
        const scores = await (args.gameMode !== undefined
            ? ctx.db.query("scores")
                .withIndex("by_nameCount", (q) => q.eq("nameCount", args.gameMode!))
                .collect()
            : ctx.db.query("scores").collect());

        // Create a map to store normalized name counts
        const nameCountMap = new Map<
            string,
            { count: number; variants: Set<string> }
        >();

        // Process each score's completed names
        for (const score of scores) {
            for (const name of score.completedNames) {
                const normalizedName = normalizeNameForComparison(name);

                if (!nameCountMap.has(normalizedName)) {
                    nameCountMap.set(normalizedName, { count: 0, variants: new Set() });
                }

                const entry = nameCountMap.get(normalizedName)!;
                entry.count++;
                entry.variants.add(name);
            }
        }

        // Convert map to array and sort by count
        const nameStats: NameStat[] = Array.from(nameCountMap.entries())
            .map(([normalizedName, { count, variants }]) => ({
                name: normalizedName,
                count,
                variants: Array.from(variants),
            }))
            .sort((a, b) => b.count - a.count);

        return {
            stats: nameStats,
            gameMode: args.gameMode ?? null,
            totalNames: nameStats.length,
            totalOccurrences: nameStats.reduce((sum, stat) => sum + stat.count, 0),
        };
    },
});

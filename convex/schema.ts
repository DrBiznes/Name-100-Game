import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Main scores table - stores all game completions
  scores: defineTable({
    username: v.string(), // 3-character username
    score: v.number(), // Completion time in seconds
    completedNames: v.array(v.string()), // Array of names entered
    nameCount: v.number(), // Game mode: 20, 50, or 100
    submissionDate: v.number(), // Timestamp
    userIdentifier: v.string(), // Fingerprint hash for user identification
    usernameColor: v.string(), // Hex color for display
  })
    .index("by_nameCount", ["nameCount"])
    .index("by_nameCount_score", ["nameCount", "score"])
    .index("by_userIdentifier", ["userIdentifier"])
    .index("by_submissionDate", ["submissionDate"]),

  // Users table - tracks unique users by fingerprint
  users: defineTable({
    fingerprintHash: v.string(), // Hash of browser fingerprint
    createdAt: v.number(), // First seen timestamp
    lastSeenAt: v.number(), // Last activity timestamp
  })
    .index("by_fingerprintHash", ["fingerprintHash"]),
});

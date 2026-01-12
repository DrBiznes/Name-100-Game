/**
 * Normalizes a name for comparison by:
 * - Converting to lowercase
 * - Removing diacritics
 * - Replacing hyphens with spaces
 * - Removing periods
 * - Trimming whitespace
 */
export function normalizeNameForComparison(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/-/g, " ") // Replace hyphens with spaces
        .replace(/\./g, "") // Remove periods
        .trim(); // Remove leading/trailing whitespace
}

/**
 * Converts a string to a consistent hash number
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Converts HSL values to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a hex color from fingerprint and username combination
 */
export function generateColor(fingerprint: string, username: string): string {
    // Combine fingerprint and username with a separator to ensure uniqueness
    const combinedString = `${fingerprint}:${username}`;
    const hash = hashString(combinedString);

    // Use the hash to generate HSL values
    const h = hash % 360; // Hue: 0-359
    const s = 70 + (hash % 20); // Saturation: 70-90%
    const l = 50 + (hash % 15); // Lightness: 50-65%

    return hslToHex(h, s, l);
}

/**
 * Game modes constant
 */
export const GAME_MODES = [20, 50, 100] as const;
export type GameMode = (typeof GAME_MODES)[number];

/**
 * Validates game mode
 */
export function isValidGameMode(mode: number): mode is GameMode {
    return GAME_MODES.includes(mode as GameMode);
}

/**
 * Validates username format
 */
export function isValidUsername(username: string): boolean {
    if (username.length !== 3) return false;
    const allowedChars = /^[A-Za-z!$?&()#@+=\/]+$/;
    return allowedChars.test(username);
}

import { useState, useEffect } from "react";

// Simple fingerprinting using browser characteristics
// This provides a reasonably unique identifier without external dependencies
async function generateFingerprint(): Promise<string> {
    const components: string[] = [];

    // Screen information
    components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
    components.push(screen.pixelDepth?.toString() || "");

    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Language
    components.push(navigator.language);
    components.push(navigator.languages?.join(",") || "");

    // Platform
    components.push(navigator.platform);

    // Hardware concurrency
    components.push(navigator.hardwareConcurrency?.toString() || "");

    // Device memory (if available)
    components.push(
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory?.toString() || ""
    );

    // Touch support
    components.push(navigator.maxTouchPoints?.toString() || "0");

    // WebGL renderer (provides GPU info)
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl && gl instanceof WebGLRenderingContext) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
                components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
                components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            }
        }
    } catch {
        // WebGL not available
    }

    // Canvas fingerprint
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
            canvas.width = 200;
            canvas.height = 50;
            ctx.textBaseline = "top";
            ctx.font = "14px Arial";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Fingerprint", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Canvas", 4, 17);
            components.push(canvas.toDataURL());
        }
    } catch {
        // Canvas not available
    }

    // Audio context fingerprint
    try {
        const audioContext = new (window.AudioContext ||
            (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        components.push(audioContext.sampleRate.toString());
        audioContext.close();
    } catch {
        // Audio context not available
    }

    // Combine all components and hash
    const fingerprintString = components.join("|");
    const hash = await hashString(fingerprintString);

    return hash;
}

async function hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const FINGERPRINT_STORAGE_KEY = "name100_fingerprint";

export function useFingerprint() {
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initFingerprint() {
            // Check localStorage first
            const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);

            if (storedFingerprint) {
                setFingerprint(storedFingerprint);
                setIsLoading(false);
                return;
            }

            // Generate new fingerprint
            try {
                const newFingerprint = await generateFingerprint();
                localStorage.setItem(FINGERPRINT_STORAGE_KEY, newFingerprint);
                setFingerprint(newFingerprint);
            } catch (error) {
                // Fallback to a random ID if fingerprinting fails
                const fallbackId = crypto.randomUUID();
                localStorage.setItem(FINGERPRINT_STORAGE_KEY, fallbackId);
                setFingerprint(fallbackId);
            }

            setIsLoading(false);
        }

        initFingerprint();
    }, []);

    return { fingerprint, isLoading };
}

// Export for non-hook usage (e.g., in components that need it immediately)
export async function getFingerprint(): Promise<string> {
    const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
    if (storedFingerprint) {
        return storedFingerprint;
    }

    const newFingerprint = await generateFingerprint();
    localStorage.setItem(FINGERPRINT_STORAGE_KEY, newFingerprint);
    return newFingerprint;
}

export type ModeConfig = {
    objetivo: number;
    rango: number;
    ciego: boolean;
};

export type Mode = "normal" | "dificil";

export type ConfigValues = {
    normal: ModeConfig;
    dificil: ModeConfig;
};

export const STORAGE_KEY = "boring-stopwatch-config";

export const defaultConfig: ConfigValues = {
    normal: { objetivo: 10, rango: 1, ciego: false },
    dificil: { objetivo: 10, rango: 1, ciego: false },
};

export function loadConfig(): ConfigValues {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return defaultConfig;
        const parsed = JSON.parse(stored);
        return {
            normal: { ...defaultConfig.normal, ...parsed.normal },
            dificil: { ...defaultConfig.dificil, ...parsed.dificil },
        };
    } catch {
        return defaultConfig;
    }
}

export type SoundName = "start" | "win" | "lose" | "perfect";

const SOUNDS: Record<SoundName, string> = {
    start: "/sounds/start.mp3",
    win: "/sounds/win.mp3",
    lose: "/sounds/lose.mp3",
    perfect: "/sounds/perfect.mp3",
};

let audioContext: AudioContext | null = null;
let preloaded = false;
const buffers = new Map<SoundName, AudioBuffer>();

function getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!audioContext) {
        const Ctor =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        audioContext = new Ctor();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => { });
    }
    return audioContext;
}

function load(name: SoundName): Promise<AudioBuffer> {
    const ctx = getContext();
    if (!ctx) return Promise.reject();
    return fetch(SOUNDS[name])
        .then((res) => res.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data));
}

export function preloadSounds() {
    if (preloaded || typeof window === "undefined") return;
    preloaded = true;
    (Object.keys(SOUNDS) as SoundName[]).forEach((name) => {
        load(name)
            .then((buffer) => buffers.set(name, buffer))
            .catch(() => { });
    });
}

function playBuffer(ctx: AudioContext, buffer: AudioBuffer, volume: number) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
}

export function playSound(name: SoundName, volume = 0.8) {
    const ctx = getContext();
    if (!ctx) return;

    const buffer = buffers.get(name);
    if (buffer) {
        playBuffer(ctx, buffer, volume);
        return;
    }

    load(name)
        .then((decoded) => {
            buffers.set(name, decoded);
            playBuffer(ctx, decoded, volume);
        })
        .catch(() => { });
}
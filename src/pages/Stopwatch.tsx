import { Center, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { loadConfig, Mode } from "../config";
import { playSound, SoundName } from "../sounds";
import { useGamepad } from "../hooks/useGamepad";
import classes from "../Stopwatch.module.css";

type Status = "idle" | "running" | "stopped";
type Result = "perfect" | "won" | "lost";

const RESULT_SOUNDS: Record<Result, SoundName> = {
    perfect: "perfect",
    won: "win",
    lost: "lose",
};

const MODES: Mode[] = ["normal", "dificil"];

function getMode(): Mode {
    const mode = new URLSearchParams(window.location.search).get("mode");
    return MODES.includes(mode as Mode) ? (mode as Mode) : "normal";
}

function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return (
        [minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":") +
        ":" + String(centis).padStart(2, "0")
    );
}

export default function Stopwatch() {
    const [status, setStatus] = useState<Status>("idle");
    const [elapsed, setElapsed] = useState(0);
    const [result, setResult] = useState<Result | null>(null);
    const [blindHidden, setBlindHidden] = useState(false);
    const [blindFadingOut, setBlindFadingOut] = useState(false);
    const statusRef = useRef(status);
    const runningRef = useRef(false);
    const startRef = useRef(0);
    const accumulatedRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    const mode = getMode();
    const config = loadConfig()[mode];
    statusRef.current = status;

    const handleKeyDown = () => {
        if (statusRef.current === "idle") {
            startRef.current = performance.now();
            runningRef.current = true;
            setStatus("running");
            playSound("start");
        } else if (statusRef.current === "running") {
            runningRef.current = false;
            accumulatedRef.current += performance.now() - startRef.current;
            setElapsed(accumulatedRef.current);
            const diff = accumulatedRef.current / 1000 - config.objetivo;
            const absDiff = Math.abs(diff);
            const perfect = Math.floor(accumulatedRef.current / 10) === Math.floor((config.objetivo * 1000) / 10);
            setResult(perfect ? "perfect" : absDiff <= config.rango ? "won" : "lost");
            setStatus("stopped");
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const isAlphanumeric = /^[a-z0-9]$/i.test(e.key);
        const isArrowKey = e.key.startsWith("Arrow");
        const isEnterKey = e.key === "Enter";
        const isSpaceKey = e.code === "Space";
        if (isSpaceKey) {
            e.preventDefault();
            handleKeyDown();
        } else if (isAlphanumeric || isArrowKey || isEnterKey) {
            if (statusRef.current === "stopped") {
                e.preventDefault();
                window.location.href = "/";
            }
        }
    };

    useGamepad({
        onTrigger: () => {
            if (statusRef.current === "stopped") {
                window.location.href = "/";
            }
        },
        onA: handleKeyDown,
    });

    const updateTimer = () => {
        if (!runningRef.current) return;
        setElapsed(accumulatedRef.current + performance.now() - startRef.current);
        animationRef.current = requestAnimationFrame(updateTimer);
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [config.objetivo, config.rango]);

    useEffect(() => {
        if (status !== "running") return;

        animationRef.current = requestAnimationFrame(updateTimer);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [status]);

    useEffect(() => {
        if (result === null) return;

        playSound(RESULT_SOUNDS[result]);
    }, [result]);

    useEffect(() => {
        if (!config.ciego) return;

        if (status === "running") {
            setBlindFadingOut(true);
            setBlindHidden(false);
        } else {
            setBlindFadingOut(false);
            setBlindHidden(false);
        }
    }, [status, elapsed, config.ciego]);

    const blindClass = config.ciego
        ? blindHidden
            ? classes.timerBlindHidden
            : blindFadingOut
                ? classes.timerBlindFadeOut
                : undefined
        : undefined;

    const timerClass =
        result === "perfect"
            ? classes.timerPerfect
            : result === "won"
                ? classes.timerWin
                : result === "lost"
                    ? classes.timerLost
                    : undefined;

    return (
        <Center bg="black" h="100vh">
            <Stack align="center">
                <Text size="1.5rem" c="white" ta="center">
                    Deten el cronometro entre {formatTime(config.objetivo * 1000 - config.rango * 1000)} y {formatTime(config.objetivo * 1000 + config.rango * 1000)}
                </Text>
                <Text size="10rem" c="digitalRed.6" className={`${timerClass ?? ""} ${blindClass ?? ""}`}>
                    {formatTime(elapsed)}
                </Text>

                <Text size="8rem" c="digitalRed.6" ta="center" className={result === "perfect" ? classes.timerPerfect : undefined}>
                    {result === "perfect"
                        ? "PUNTAJE PERFECTO"
                        : result === "won"
                            ? "GANASTE"
                            : result === "lost"
                                ? "PERDISTE"
                                : "\u00A0"}
                </Text>

            </Stack>
        </Center>
    );
}

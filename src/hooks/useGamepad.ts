import { useEffect, useRef } from "react";

interface GamepadState {
    lt: boolean;
    rt: boolean;
    a: boolean;
}

interface GamepadCallbacks {
    onTrigger?: () => void;
    onA?: () => void;
}

export function useGamepad({ onTrigger, onA }: GamepadCallbacks) {
    const onTriggerRef = useRef(onTrigger);
    const onARef = useRef(onA);
    onTriggerRef.current = onTrigger;
    onARef.current = onA;

    const previousGamepadStatesRef = useRef<Record<number, GamepadState>>({});

    useEffect(() => {
        let rafId: number | null = null;

        const pollGamepad = () => {
            for (const gamepad of navigator.getGamepads()) {
                if (!gamepad) continue;

                const lt = gamepad.buttons[6];
                const rt = gamepad.buttons[7];
                const a = gamepad.buttons[0];

                const ltActive = lt ? lt.pressed || lt.value > 0.5 : false;
                const rtActive = rt ? rt.pressed || rt.value > 0.5 : false;
                const aActive = a ? a.pressed || a.value > 0.5 : false;

                if (!previousGamepadStatesRef.current[gamepad.index]) {
                    previousGamepadStatesRef.current[gamepad.index] = { lt: false, rt: false, a: false };
                }

                const prevState = previousGamepadStatesRef.current[gamepad.index];

                if (ltActive && !prevState.lt) onTriggerRef.current?.();
                if (rtActive && !prevState.rt) onTriggerRef.current?.();
                if (aActive && !prevState.a) onARef.current?.();

                previousGamepadStatesRef.current[gamepad.index] = {
                    lt: ltActive,
                    rt: rtActive,
                    a: aActive,
                };
            }

            rafId = requestAnimationFrame(pollGamepad);
        };

        const onConnected = () => {
            if (rafId === null) rafId = requestAnimationFrame(pollGamepad);
        };

        if (navigator.getGamepads?.().some((g) => !!g)) onConnected();
        window.addEventListener("gamepadconnected", onConnected);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener("gamepadconnected", onConnected);
        };
    }, []);
}
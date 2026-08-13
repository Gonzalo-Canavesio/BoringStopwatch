import { Button, Center, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { Mode } from "../config";
import { useGamepad } from "../hooks/useGamepad";

const MODES: { label: string; mode: Mode }[] = [
    { label: "MODO NORMAL", mode: "normal" },
    { label: "MODO DIFICIL", mode: "dificil" },
];

export default function Home() {
    const [selected, setSelected] = useState<Mode>(MODES[0].mode);

    const toggleSelection = () => {
        setSelected((prev) => (prev === "normal" ? "dificil" : "normal"));
    };

    useGamepad({
        onTrigger: toggleSelection,
        onA: () => (document.activeElement as HTMLElement)?.click(),
    });

    const goToStopwatch = (mode: Mode) => {
        window.location.href = `/stopwatch?mode=${mode}`;
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const isAlphanumeric = /^[a-z0-9]$/i.test(e.key);
        const isArrowKey = e.key.startsWith("Arrow");
        const isEnterKey = e.key === "Enter";

        if (isAlphanumeric || isArrowKey || isEnterKey) {
            e.preventDefault();
            toggleSelection();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <Center bg="black" h="100vh">
            <Group gap="xl">
                {MODES.map(({ label, mode }) => (
                    <Button
                        key={label}
                        size="xl"
                        fz="5rem"
                        variant="digital"
                        ref={(ref) => {
                            if (ref && mode === selected) {
                                ref.focus();
                            }
                        }}
                        h="auto"
                        onClick={() => goToStopwatch(mode)}
                    >
                        {label}
                    </Button>
                ))}
            </Group>
        </Center>
    );
}

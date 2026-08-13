import { Button, Center, Group, NumberInput, Stack, Switch, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ConfigValues, STORAGE_KEY, loadConfig } from "../config";

const MODES: { key: keyof ConfigValues; label: string }[] = [
    { key: "normal", label: "MODO NORMAL" },
    { key: "dificil", label: "MODO DIFICIL" },
];

export default function Config() {
    const form = useForm<ConfigValues>({
        initialValues: loadConfig(),
    });

    const handleSubmit = form.onSubmit((values) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        window.location.pathname = "/";
    });

    return (
        <Center bg="black" h="100vh">
            <form onSubmit={handleSubmit}>
                <Group gap="xl">
                    {MODES.map(({ key, label }) => (
                        <Stack key={key} bd="1px solid white" bdrs="md" p="xl">
                            <Title ta="center" order={2}>{label}</Title>
                            <Text ta="center" c="dimmed">Acepta tiempos entre {form.values[key].objetivo - form.values[key].rango} y {form.values[key].objetivo + form.values[key].rango} segundos</Text>
                            <NumberInput
                                size="xl"
                                label="Objetivo (segundos)"
                                description="Tiempo en el que el cronometro debe detenerse para considerarse exitoso."
                                {...form.getInputProps(`${key}.objetivo`)}
                            />
                            <NumberInput
                                size="xl"
                                label="Rango de aceptacion (segundos)"
                                description="Margen de error permitido para que el cronometro se considere exitoso."
                                {...form.getInputProps(`${key}.rango`)}
                            />
                            <Switch
                                size="xl"
                                label="Modo ciego"
                                description="Oculta el cronometro una vez que se inicia."
                                {...form.getInputProps(`${key}.ciego`, { type: "checkbox" })}
                            />
                        </Stack>
                    ))}
                </Group>
                <Button fullWidth size="xl" type="submit" mt="xl">Guardar</Button>
            </form>
        </Center>
    );
}

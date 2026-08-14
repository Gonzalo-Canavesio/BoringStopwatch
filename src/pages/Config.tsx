import { Button, Flex, NumberInput, Stack, Switch, Text, Title } from "@mantine/core";
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
        <form onSubmit={handleSubmit}>
            <Flex
                bg="black"
                mih="100dvh"
                miw="100dvw"
                gap="xl"
                justify="center"
                align="center"
                direction="column"
                style={{ fontFamily: "Helvetica, sans-serif" }}
            >
                <Flex gap="xl" direction={{ base: "column", sm: "row" }} justify="center"
                    align="center">
                    {MODES.map(({ key, label }) => (
                        <Stack key={key} bd="1px solid white" bdrs="lg" p="lg" >
                            <Flex direction="column" gap="xs" align="center">
                                <Title ta="center" order={2} style={{ fontFamily: "Helvetica, sans-serif" }}
                                >{label}</Title>
                                <Text ta="center" c="dimmed">Acepta tiempos entre {form.values[key].objetivo - form.values[key].rango} y {form.values[key].objetivo + form.values[key].rango} segundos</Text>
                            </Flex>
                            <NumberInput
                                size="lg"
                                label="Objetivo (segundos)"
                                description="Tiempo en el que el cronometro debe detenerse para considerarse exitoso."
                                {...form.getInputProps(`${key}.objetivo`)}
                            />
                            <NumberInput
                                size="lg"
                                label="Rango de aceptacion (segundos)"
                                description="Margen de error permitido para que el cronometro se considere exitoso."
                                {...form.getInputProps(`${key}.rango`)}
                            />
                            <Switch
                                size="lg"
                                label="Modo ciego"
                                description="Oculta el cronometro una vez que se inicia."
                                {...form.getInputProps(`${key}.ciego`, { type: "checkbox" })}
                            />
                        </Stack>
                    ))}
                </Flex>
                <Button size="xl" type="submit" mt="xl">Guardar</Button>
            </Flex>
        </form>
    );
}

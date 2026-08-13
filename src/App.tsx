import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { theme } from "./theme";
import { preloadSounds } from "./sounds";
import Home from "./pages/Home";
import Config from "./pages/Config";
import Stopwatch from "./pages/Stopwatch";

export default function App() {
  const currentPath = window.location.pathname;

  useEffect(() => {
    preloadSounds();
  }, []);

  return <MantineProvider theme={theme}>
    {currentPath === "/" && <Home />}
    {currentPath === "/config" && <Config />}
    {currentPath === "/stopwatch" && <Stopwatch />}
  </MantineProvider>;
}

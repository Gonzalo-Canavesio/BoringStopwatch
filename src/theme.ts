import { createTheme, Button } from "@mantine/core";
import "./global.css";
import classes from "./DigitalButton.module.css"

export const theme = createTheme({
  fontFamily: "Digital-7, monospace",

  headings: {
    fontFamily: "Digital-7, monospace",
  },

  colors: {
    digitalRed: [
      "#ffe7e8",
      "#ffcece",
      "#ff9b9b",
      "#ff6464",
      "#fe3736",
      "#fe1b19",
      "#ff0000",
      "#e40000",
      "#cb0000",
      "#b20000",
    ],
  },

  primaryColor: "digitalRed",
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
});
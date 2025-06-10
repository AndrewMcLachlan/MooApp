import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import "../../moo-app/src/css/mooapp.css";

const preview: Preview = {
  parameters: {

    docs: {
      theme: { ...themes.dark, appBg: "#000000" },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

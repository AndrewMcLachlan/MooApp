import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import "../../moo-app/scss/mooapp.scss";

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

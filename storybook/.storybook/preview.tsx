import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { LinkComponent, LinkProvider, NavLinkComponent } from "@andrewmclachlan/moo-ds";
import "../../moo-ds/src/css/mooapp.css";

library.add(fas);

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
  decorators: [
    (Story) => {
      useEffect(() => {
        document.body.classList.add("dark");
        document.body.setAttribute("data-bs-theme", "dark");
      }, []);

      // Mock Link component for Storybook
      const MockLink: LinkComponent = ({ children, className, ...props }) => (
        <a {...props} className={className}>{children}</a>
      );

      // Mock NavLink component for Storybook
      const MockNavLink: NavLinkComponent = ({ children, className, ...props }) => {
        const finalClassName = typeof className === 'function' 
          ? className({ isActive: false }) // Default to inactive in Storybook
          : className;
        return <a {...props} className={finalClassName}>{children}</a>;
      };

      return (
        <LinkProvider 
          LinkComponent={MockLink}
          NavLinkComponent={MockNavLink}
        >
          <Story />
        </LinkProvider>
      );
    },
  ],
};

export default preview;

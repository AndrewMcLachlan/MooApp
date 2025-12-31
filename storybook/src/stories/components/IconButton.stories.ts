import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { default as ReactSvg } from "../../assets/react.svg?react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { IconButton } from "@andrewmclachlan/moo-ds";
import { Budget } from "@andrewmclachlan/moo-icons";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Moo App/Components/IconButton",
  component: IconButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MooIcon: Story = {
  args: {
    title: "Moo icon",
    children: "Icon Button",
    icon: Budget,
  },
};

export const FontAwesome: Story = {
  args: {
    children: "Icon Button",
    icon: faHome,
  },
};

export const CustomSVG: Story = {
  args: {
    title: "Custom SVG",
    children: "Icon Button",
    icon: ReactSvg,
  },
};
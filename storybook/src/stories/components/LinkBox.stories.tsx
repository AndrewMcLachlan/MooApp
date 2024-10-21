import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { default as ReactSvg } from "../../assets/react.svg?react";
import { LinkBox } from "@andrewmclachlan/mooapp";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Moo App/Components/LinkBox",
  component: LinkBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
   // image: { control: "object", type: { name: "string" } },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof LinkBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const string: Story = {
  args: {
    href: "https://www.example.com",
    image: "https://cdn.mclachlan.family/images/logos/entra.svg",
    children: "Link Box"
  },
};

export const SVG: Story = {
  args: {
    href: "https://www.example.com",
    image: <ReactSvg />,
    children: "Link Box"
  },
};

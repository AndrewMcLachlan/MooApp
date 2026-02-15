import type { Meta, StoryObj } from "@storybook/react-vite";
//import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import { EditColumn } from "@andrewmclachlan/moo-ds";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Moo App/Components/EditColumn",
  component: EditColumn,
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
  args: {
    value: "Edit Column",
   },
  decorators: [
    (Story) => (
      <div className="dark" data-theme="dark">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Editable</th>
              <th>Static</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Story />
              <td>Some Value</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  ],
} satisfies Meta<typeof EditColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = (args: any) => {
  const [{...rest}, setArgs] = useArgs();

  const onChange = (target: any) => {
    setArgs({...args, value: target.value});
  };

  return (
    <EditColumn {...rest} onChange={onChange} />

  );
};

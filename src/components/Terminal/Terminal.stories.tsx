import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Terminal } from "./Terminal";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ReactComponentLibrary/Terminal",
  component: Terminal,
} as Meta<typeof Terminal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Terminal> = (args) => <Terminal {...args} />;

export const DefaultTerminal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DefaultTerminal.args = {};

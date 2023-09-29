# Task description:

The task was to create a terminal-like React component. Users should be able to type commands in the terminal and see responses displayed in command line format.

Guidelines:

- Define a set of dummy commands and responses that will be recognized by the terminal. For example, when the user types "help", the terminal should display a list of available commands.
- Implement interactive features such as command history, command autocompletion and error handling for unrecognized commands.
- Add custom commands as component props
- Style the terminal component to make it visually appealing. You can use CSS or a styling library of your choice.
- Provide a README file with instructions on how to integrate and use the Terminal component in a sample React application.
- Publish the component as a custom NPM package

## Usage

```
import { Terminal } from "@bbrojson/terminal";

function App(props) {
  // Define commands here
  const commands = {
    hello: (terminal: any, [command]: string[]) => {
      terminal.sendMessage("Hello little fellow!");
    },
  };

  return <Terminal commands={commands} />;
}

```

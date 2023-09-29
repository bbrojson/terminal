import React, { useEffect } from "react";
import { Command } from "./Command";
import { Output } from "./Output";
import internalStyles from "./Terminal.module.scss";
import { parsePrompt } from "./utils";
import { useTerminal } from "./useTerminal";
import DEFAULT_COMMANDS from "./defaultCommands";

export type TerminalStyles = {
  active: string;
  container: string;
  done: string;
  pending: string;
  input: string;
  root: string;
  spinner: string;
  output: string;

  command: string;
  message: string;
  error: string;
  custom: string;
  prompt: string;
};

export type TerminalProps = {
  styles?: TerminalStyles;
  customCommands: any;
};

export function Terminal({
  styles: customStyles,
  customCommands,
}: TerminalProps) {
  const styles = customStyles || (internalStyles as TerminalStyles);
  const commands = { ...DEFAULT_COMMANDS, ...customCommands };

  const {
    prompt,
    setPrompt,
    ouptutMessages,
    waitingForInput,
    handleCommand,
    handlePromptCallback,
    commandKey,
    isPending,
  } = useTerminal(commands);

  useEffect(() => {
    if (!prompt.text) return;

    if (waitingForInput) {
      handlePromptCallback(prompt.text);
      return;
    }

    const { command, params } = parsePrompt(prompt.text);
    handleCommand(command, params);
  }, [prompt]);

  return (
    <div data-testid="terminal" className={styles.root}>
      <div className={styles.container}>
        <Output styles={styles} output={ouptutMessages} />
        <Command
          key={commandKey}
          styles={styles}
          handleFirePrompt={setPrompt}
          waitingForInput={waitingForInput}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Command } from "./Command";
import { Output } from "./Output";
import internalStyles from "./Terminal.module.scss";
import { parsePrompt } from "./utils";
import { OuptutMessage } from "./types";

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

function useTerminal(commands: any) {
  const [prompt, setPrompt] = useState({ text: "" });
  const [ouptutMessages, setOutputMessages] = useState<OuptutMessage[]>([]);
  const [promptAction, setPromptAction] = useState({
    waitingForInput: false,
    callback: (s: string) => Promise.resolve(s),
  });
  const [isPending, setIsPending] = useState(false);

  const [commandKey, setCommandKey] = useState(0);

  function clear() {
    setOutputMessages([]);
  }

  function wipe() {
    setCommandKey((prev) => prev + 1);
  }

  function sendOutputMessages(message: OuptutMessage) {
    setOutputMessages((prev) => [...prev, message]);
  }
  function sendMessage(message: string, type: "message" | "error" = "message") {
    setOutputMessages((prev) => [
      ...prev,
      {
        type,
        prefix: "",
        message,
      },
    ]);
  }

  function sendPrompt(message: string, callback: any) {
    sendOutputMessages({
      type: "prompt",
      prefix: "",
      message,
    });

    setPromptAction({
      waitingForInput: true,
      callback,
    });
  }

  async function handleCommand(commandToHandle: string, parameters: string[]) {
    sendOutputMessages({
      type: "command",
      prefix: commandToHandle,
      message: prompt.text,
    });
    setPrompt({ text: "" });

    const commandFunction = commands[commandToHandle as keyof typeof commands];

    if (commandFunction) {
      try {
        setIsPending(true);
        await commandFunction(
          {
            clear,
            wipe,
            sendMessage,
            sendPrompt,
            commands,
          },
          parameters
        );
      } catch (e: any) {
        sendMessage(e.message, "error");
      } finally {
        setIsPending(false);
      }
      return;
    }

    sendOutputMessages({
      type: "message",
      prefix: commandToHandle,
      message: "command not found",
    });
  }
  async function handlePromptCallback(text: string) {
    try {
      setIsPending(true);
      await promptAction.callback(text);
    } catch (e: any) {
      sendMessage(e.message, "error");
    } finally {
      setIsPending(false);
      setPromptAction({
        waitingForInput: false,
        callback: (s: string) => Promise.resolve(s),
      });
    }
  }

  return {
    prompt,
    setPrompt,
    clear,
    wipe,
    sendMessage,
    sendPrompt,

    sendOutputMessages,
    ouptutMessages,
    commands,

    waitingForInput: promptAction.waitingForInput,
    handleCommand,
    handlePromptCallback,

    commandKey,

    isPending,
    setIsPending,
  };
}

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

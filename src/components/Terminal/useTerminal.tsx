import { useState } from "react";
import { OuptutMessage } from "./types";

export function useTerminal(commands: any) {
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

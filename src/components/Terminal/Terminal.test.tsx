import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Terminal } from "./Terminal";

function writeText(container: any, value: string, metaKey = false) {
  if (
    [
      "Enter",
      "Backspace",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ].includes(value)
  ) {
    fireEvent.keyDown(container, {
      metaKey,
      key: value,
    });
    return;
  }

  value.split("").forEach((char) => {
    fireEvent.keyDown(container, {
      metaKey,
      key: char,
    });
  });
}

describe("Terminal", () => {
  test("renders the Terminal component", () => {
    render(<Terminal customCommands={{}} />);
  });

  test("execute an invalid command on terminal component returns default text", async () => {
    render(<Terminal customCommands={{}} />);

    const terminalInput = screen.getByLabelText("terminal-prompt");
    const terminalContainer = screen.getByTestId("terminal");

    await userEvent.click(terminalInput);
    fireEvent.change(terminalInput, { target: { value: "asd" } });
    writeText(terminalInput, "Enter");

    expect(terminalContainer.textContent).toContain("command not found");
  });

  test("execute a valid command on terminal component", async () => {
    const promise = Promise.resolve();
    render(<Terminal customCommands={{}} />);
    const terminalInput = screen.getByLabelText("terminal-prompt");
    const terminalContainer = screen.getByTestId("terminal");

    // await userEvent.click(terminalInput);
    fireEvent.change(terminalInput, { target: { value: "help" } });
    writeText(terminalInput, "Enter");

    expect(terminalContainer.textContent).toContain(
      "Commands: clear, help, wipe, wait"
    );

    // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning#an-alternative-waiting-for-the-mocked-promise
    await act(async () => {
      await promise;
    });
  });
});

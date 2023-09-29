import React, { useEffect, useState } from 'react';
import { TerminalStyles } from './Terminal';

type CommandProps = {
  handleFirePrompt: (prompt: { text: string }) => void;
  styles: TerminalStyles;
  waitingForInput: boolean;
  isPending: boolean;
};

export function Command({
  styles,
  handleFirePrompt,
  waitingForInput,
  isPending,
}: CommandProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState(0);

  const [text, setText] = useState('');

  useEffect(() => {
    setHistoryCursor(history.length);
    setText('');

    handleFirePrompt({ text: history[history.length - 1] });
  }, [history]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();

      setText('');
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.stopPropagation();
      event.preventDefault();

      let updatedHistoryCursor = historyCursor;
      if (key === 'ArrowUp' && historyCursor > 0) updatedHistoryCursor -= 1;
      if (key === 'ArrowDown' && historyCursor < history.length - 1) {
        updatedHistoryCursor += 1;
      }

      const foundValue = history[updatedHistoryCursor];
      if (foundValue) {
        setHistoryCursor(updatedHistoryCursor);
        setText(foundValue);
      }
    }
  };

  const handleOnKeyDown = async ({
    key,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    const commandLine = text.trim();

    if (key !== 'Enter' || !commandLine) return;

    setHistory((prev) => [...prev, commandLine]);
  };

  return (
    <div className={`${styles.command} ${isPending ? styles.pending : ''}`}>
      <u>${waitingForInput && ' -> '}</u>
      {isPending && <div className={styles.spinner} />}

      <input
        type="text"
        aria-label="terminal-prompt"
        value={text}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onKeyUp={handleOnKeyUp}
        autoComplete="off"
        spellCheck={false}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
      />
    </div>
  );
}

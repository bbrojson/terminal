// !
// * This part was made fast and dirty, as I was out of time.

const translations = {
  clear: 'clear the terminal screen',
  version: 'print the terminal version',
  wipe: 'Remove all your history of command lines',
};

export default {
  clear: async (terminal: any) => {
    terminal.clear();
  },
  help: (terminal: any, [command]: string[]) => {
    if (command) {
      terminal.sendMessage(
        `help: ${
          translations[command as keyof typeof translations] ||
          `no help topics match <u>${command}</u>`
        }`,
      );
    } else {
      terminal.sendMessage(
        'These shell commands are defined internally. Type <u>help</u> for see the list.',
      );
      terminal.sendMessage(
        'Type <u>help name</u> to find out more about the function <u>name</u>.',
      );
      terminal.sendMessage(
        `Commands: ${Object.keys(terminal.commands).join(', ')}`,
      );
    }
  },
  wipe: (terminal: any) => {
    terminal.sendPrompt(
      'Remove all commands history? Y/N',
      async (value: string) => {
        if (value.trim().toUpperCase() === 'Y') {
          terminal.wipe();
          terminal.sendMessage('History of commands wiped.');
        } else {
          terminal.sendMessage('quit');
        }
      },
    );
  },
  wait: async (terminal: any, [time]: string[]) => {
    const parsedTime = parseInt(time ?? 1000, 10);

    if (parsedTime) {
      terminal.sendMessage(`Waiting ${parsedTime}ms...`);

      return new Promise((resolve) => {
        setTimeout(() => {
          terminal.sendMessage(`...done.`);
          resolve(true);
        }, parsedTime);
      });
    }
    return false;
  },
};

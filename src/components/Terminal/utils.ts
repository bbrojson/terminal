export function parsePrompt(prompt: string) {
  const [command, ...params] = prompt.split(' ');

  return {
    command,
    params,
  };
}

export type OuptutMessage = {
  type: 'command' | 'message' | 'error' | 'custom' | 'prompt';
  message: string;
  prefix: string;
};

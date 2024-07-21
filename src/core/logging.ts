let logger: ILogger | undefined = undefined;

export const Logger = {
  set(instance: ILogger): void {
    logger = instance;
  },

  debug(message: string): void {
    logger?.debug(message);
  },

  info(message: string): void {
    logger?.info(message);
  },

  warn(message: string): void {
    logger?.warn(message);
  },

  error(message: string): void {
    logger?.error(message);
  },
};

export interface ILogger {
  debug(message: string): void;

  info(message: string): void;

  warn(message: string): void;

  error(message: string): void;
}

import winston from "winston";

let logger: ILogger | undefined = undefined;

export const Logger = {
  set(instance: ILogger): void {
    logger = instance;
  },

  useWinston(): void {
    this.set(winstonLogger);
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

export const winstonLogger: ILogger = {
  debug(message: string): void {
    winston.debug(message);
  },

  info(message: string): void {
    winston.info(message);
  },

  warn(message: string): void {
    winston.warn(message);
  },

  error(message: string): void {
    winston.error(message);
  },
};

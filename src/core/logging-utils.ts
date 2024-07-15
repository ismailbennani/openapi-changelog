import winston, { format } from "winston";

export function setupConsoleLoggingIfNecessary(args?: { output?: string | undefined; colors?: boolean | undefined }) {
  for (const logger of winston.loggers.loggers.values()) {
    const consoleTransport = logger.transports.find((t) => t instanceof winston.transports.Console);
    if (consoleTransport !== undefined) {
      return consoleTransport;
    }
  }

  const options: winston.transports.ConsoleTransportOptions = {
    format: format.combine(args?.colors === true ? format.colorize() : format.uncolorize(), format.simple()),
    level: "info",
  };

  if (args?.output !== undefined) {
    options.stderrLevels = ["error", "warn", "info"];
  }

  const consoleTransport = new winston.transports.Console(options);
  winston.add(consoleTransport);

  return consoleTransport;
}

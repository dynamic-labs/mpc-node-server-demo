import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Console()],
});

export default logger;

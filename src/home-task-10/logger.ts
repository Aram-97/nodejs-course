import winston from "winston";
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extraData = JSON.stringify(meta, null, 1).replaceAll(/\n/g, "").replace(/}$/, " }");

  return `${timestamp} [${level.toUpperCase()}] ${message} ${extraData}`;
});

export const LOGGER = winston.createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: "./src/home-task-10",
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      dirname: "./src/home-task-10",
      filename: "combined.log",
    }),
  ],
});

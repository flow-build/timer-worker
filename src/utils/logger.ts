import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: process.env.KOA_LOG_LEVEL || "info",
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.label({ label: 'KW', message: true}),
    format.printf((info) => `${info.timestamp} ${info.level}`)
  ),
  transports: [ 
    new transports.Console()
  ],
  exceptionHandlers: [
    new transports.Console({
      format: format.errors()
    })
  ],
  rejectionHandlers: [
    new transports.Console()
  ]
})
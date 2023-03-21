require("dotenv").config()
export const connection = {
  host: process.env.TIMER_HOST ? process.env.TIMER_HOST : 'localhost',
  port: process.env.TIMER_PORT ? parseInt(process.env.TIMER_PORT) : 6379
}
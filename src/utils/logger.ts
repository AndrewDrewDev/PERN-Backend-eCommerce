import pino from 'pino'

// Create a logging instance
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  prettyPrint: process.env.NODE_ENV !== 'production',
})
export default logger

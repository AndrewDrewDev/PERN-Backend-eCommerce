import pino from 'pino'
import { StartModeEnum } from '../types'

// Create a logging instance
const logger = pino({
  level: process.env.NODE_ENV === StartModeEnum.Production ? 'info' : 'debug',
  prettyPrint: process.env.NODE_ENV !== StartModeEnum.Production,
})
export default logger

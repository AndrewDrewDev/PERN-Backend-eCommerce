import pino from 'pino'
import { StartModeEnum } from '../types'
import getEnvVariable from './getEnvVariable'

// Create a logging instance
const logger = pino({
  level:
    getEnvVariable('NODE_ENV') === StartModeEnum.Production ? 'info' : 'debug',
  prettyPrint: getEnvVariable('NODE_ENV') !== StartModeEnum.Production,
})
export default logger

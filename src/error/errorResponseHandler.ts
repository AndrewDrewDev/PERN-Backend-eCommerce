import { ErrorRequestHandler } from 'express'
import logger from '../utils/logger'

const errorResponseHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode, message } = err
  logger.error(err, message)
  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: statusCode === 500 ? 'An error occurred' : message,
  })
  next()
}

export default errorResponseHandler

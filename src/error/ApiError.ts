import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'

const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = err
  logger.error(err)
  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: statusCode === 500 ? 'An error occurred!' : message,
  })
  next()
}

class ErrorHandler extends Error {
  public status: string = ''
  public statusCode: number
  constructor(statusCode: number, message: string) {
    super()
    this.status = 'error'
    this.statusCode = statusCode
    this.message = message
  }
}
export { ErrorHandler, handleError }

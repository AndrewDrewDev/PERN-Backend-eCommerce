class ErrorHandler extends Error {
  private status: string
  private statusCode: number
  constructor(statusCode: number, message: string) {
    super()
    this.status = 'error'
    this.statusCode = statusCode
    this.message = message
  }
}

export default ErrorHandler

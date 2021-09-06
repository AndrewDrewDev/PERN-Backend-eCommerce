import chalk from 'chalk'

class ApiError {
  public successLog(message: string): void {
    console.log(`${chalk.bgGreen(chalk.black(' SUCCESS '))} ${message}`)
  }

  public failedLog(message: string, err?: Error): void {
    console.log(`${chalk.bgRed(chalk.black(' FAILED '))} ${message}\n\n`)
    if (err) console.error(err)
  }
}

export default new ApiError()

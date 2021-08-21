// Main server config
export type TPORTConfig = number
export type Tconfig = {
  PORT: TPORTConfig
  DB_NAME: string
  DB_USER: string
  DB_PASSWORD: string
  DB_HOST: string
  DB_PORT: number
  SECRET_KEY: string
}

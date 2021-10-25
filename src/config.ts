import { TConfig } from '../src/types'

const config: TConfig = {
  PORT: 5000,
  DBM_EXCEL_FILE_NAME: 'Demo-DataSet-Tupperware-150.xlsx',
  DBM_EXCEL_CONFIG_FILE_NAME: 'excelConfig.json',
  DB_NAME: 'pern_eccomerce_db',
  DB_USER: 'postgres',
  DB_PASSWORD: 'sv@54321',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  SECRET_KEY: 'random_secret_key123',
}

export default config

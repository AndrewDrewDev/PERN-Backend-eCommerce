import dotenv from 'dotenv'
dotenv.config()

import { Pool } from 'pg'
import { StartModeEnum } from '../types'
import getEnvVariable from '../utils/getEnvVariable'

// Connected to PostgreSQL
class Database {
  private _pool: Pool

  constructor() {
    if (getEnvVariable('NODE_ENV') === StartModeEnum.Development) {
      this._pool = new Pool({
        user: getEnvVariable('DB_USER'),
        host: getEnvVariable('DB_HOST'),
        database: getEnvVariable('DB_NAME'),
        password: getEnvVariable('DB_PASSWORD'),
        port: Number(getEnvVariable('DB_PORT')),
      })
    } else {
      this._pool = new Pool({
        connectionString: getEnvVariable('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
      })
    }
  }

  public async query(text: string, params: any[] = []) {
    return await this._pool.query(text, params)
  }
}

const database = new Database()

export default database

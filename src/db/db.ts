import { Pool } from 'pg'
import config from '../config'
import { StartModeEnum } from '../types'

// Connected to PostgreSQL
class Database {
  private _pool: Pool

  constructor() {
    if (process.env.NODE_ENV === StartModeEnum.Development) {
      this._pool = new Pool({
        user: config.DB_USER,
        host: config.DB_HOST,
        database: config.DB_NAME,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
      })
    } else {
      this._pool = new Pool({
        connectionString: process.env.DATABASE_URL,
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

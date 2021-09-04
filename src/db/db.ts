import { Pool } from 'pg'
import config from '../config'

// Connected to PorsgresSQL
class Database {
  private _pool: Pool

  constructor() {
    this._pool = new Pool({
      user: config.DB_USER,
      host: config.DB_HOST,
      database: config.DB_NAME,
      password: config.DB_PASSWORD,
      port: config.DB_PORT,
    })
  }

  public async query(text: string, params: any[] = []) {
    return await this._pool.query(text, params)
  }
}

export default new Database()

import { Pool } from 'pg'
import config from '../config'

// Connected to PorsgresSQL
class Database {
  private db: Pool

  constructor() {
    this.db = new Pool({
      user: config.DB_USER,
      host: config.DB_HOST,
      database: config.DB_NAME,
      password: config.DB_PASSWORD,
      port: config.DB_PORT,
    })
  }

  public async query(text: string, params: any[] = []) {
    return await this.db.query(text, params)
  }
}

export default new Database()

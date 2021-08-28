import { Pool } from 'pg'
import config from 'config'

// Connected to PorsgresSQL
class Database {
  private db: Pool

  constructor() {
    this.db = new Pool({
      user: config.get('DB_USER'),
      host: config.get('DB_HOST'),
      database: config.get('DB_NAME'),
      password: config.get('DB_PASSWORD'),
      port: config.get('DB_PORT'),
    })
  }

  public async query(text: string, params: any[] = []) {
    const start = Date.now()
    const res = await this.db.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  }
}

export default new Database()

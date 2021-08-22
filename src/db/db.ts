import { Pool } from 'pg'
import config from 'config'

// Connected to PorsgresSQL
export default new Pool({
  user: config.get('DB_USER'),
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  password: config.get('DB_PASSWORD'),
  port: config.get('DB_PORT'),
})

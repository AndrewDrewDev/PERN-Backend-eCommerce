import db from '../db/db'
import { TGetUsers } from '../types'
import logger from '../utils/logger'

class UserService {
  public async getByEmail(email: string): Promise<TGetUsers | null> {
    try {
      const data = await db.query(
        `select
           us.email,
           us.password,
           us.role
         from users us
         where us.email=$1`,
        [email]
      )

      if (data.rows.length === 0) return null

      return data.rows[0]
    } catch (error) {
      throw logger.error(error, 'UserService.getByEmail occurred error')
    }
  }

  public async create(userData: TGetUsers): Promise<void> {
    const { email, password, role } = userData
    try {
      await db.query(
        `insert into users (email,password,role) values ($1,$2,$3)`,
        [email, password, role]
      )
    } catch (error) {
      throw logger.error(error, 'UserService.create occurred error')
    }
  }
}

export default new UserService()

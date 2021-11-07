import db from '../db/db'
import { TUserAuthType } from '../types'

type TGetByEmail = {
  email: string
  password: string
  role: TUserAuthType
}

class UserModel {
  public async getByEmail(email: string): Promise<TGetByEmail | null> {
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
  }

  public async create(userData: TGetByEmail): Promise<void> {
    const { email, password, role } = userData
    await db.query(
      `insert into users (email,password,role) values ($1,$2,$3)`,
      [email, password, role]
    )
  }
}

export default new UserModel()

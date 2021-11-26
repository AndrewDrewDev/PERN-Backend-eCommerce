import { NextFunction, Response, Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserService from '../model/UserModel'
import config from '../config'
import ErrorHandler from '../error/ErrorHandler'

class UserController {
  public async registration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string> | void> {
    try {
      let { email, password, role } = req.body

      if (!email && !password) {
        return res.status(403).json({ message: 'Wrong email or password!' })
      }

      if (!role) role = 'USER'

      // check if exist user in db
      const candidate = await UserService.getByEmail(email)
      if (candidate)
        return res
          .status(403)
          .json({ message: 'User with current email already exists!' })

      // Create new user
      const hashPassword = await bcrypt.hash(password, 5)

      await UserService.create({
        email,
        password: hashPassword,
        role,
      })

      const token = generateJwt({ email, role })

      return res.json({ token })
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string> | void> {
    try {
      let { email, password } = req.body

      const user = await UserService.getByEmail(email)

      if (!user) return res.status(403).json({ message: 'User not found' })

      const comparePassword = bcrypt.compareSync(password, user.password)

      if (!comparePassword)
        return res.status(403).json({ message: 'User not found' })

      const token = generateJwt({
        email: user.email,
        role: user.role,
      })

      return res.json({ token })
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async check(req: Request | any, res: Response) {
    const token = generateJwt({ email: req.user.email, role: req.user.role })
    return res.json({ token })
  }
}

const generateJwt = (args: { email: string; role: string }) => {
  const { email, role } = args

  return jwt.sign({ email, role }, config.SECRET_KEY, {
    expiresIn: '24h',
  })
}

export default new UserController()

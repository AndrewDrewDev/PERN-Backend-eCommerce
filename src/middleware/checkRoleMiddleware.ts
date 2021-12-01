import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { TUserAuthType } from '../types'
import getEnvVariable from '../utils/getEnvVariable'

const checkRoleMiddleware = (role: TUserAuthType) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') next()
    try {
      const token = req.headers.authorization.split(' ')[1]

      if (!token) return res.status(401).json({ message: 'User not auth!' })

      const decode: any = jwt.verify(token, getEnvVariable('SECRET_KEY'))

      if (decode.role !== role)
        return res.status(403).json({ message: 'No Access!' })

      req.user = decode

      next()
    } catch (error) {
      res.status(401).json({ message: 'User not auth!' })
    }
  }
}

export default checkRoleMiddleware

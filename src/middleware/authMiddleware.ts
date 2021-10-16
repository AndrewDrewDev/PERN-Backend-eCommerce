import jwt from 'jsonwebtoken'

import { NextFunction, RequestHandler, Response } from 'express'
import config from '../config'

const authMiddleware: RequestHandler = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'OPTIONS') next()
  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'User not auth!' })

    const decode = jwt.verify(token, config.SECRET_KEY)

    req.user = decode

    next()
  } catch (error) {
    res.status(401).json({ message: 'User not auth!' })
  }
}

export default authMiddleware

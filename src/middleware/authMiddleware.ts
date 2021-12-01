import jwt from 'jsonwebtoken'

import { NextFunction, RequestHandler, Response } from 'express'
import getEnvVariable from '../utils/getEnvVariable'

const authMiddleware: RequestHandler = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'OPTIONS') next()
  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'User not auth!' })

    req.user = jwt.verify(token, getEnvVariable('SECRET_KEY'))

    next()
  } catch (error) {
    res.status(401).json({ message: 'User not auth!' })
  }
}

export default authMiddleware

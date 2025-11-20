import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../auth/tokens'

declare global {
    namespace Express {
        interface Request {
            user?: unknown
        }
    }
}

export const authMW = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization')
        if(!authHeader){
            return res.unauthorized()
        }

        const parts = authHeader.split(' ')
        if(parts.length !== 2 || parts[0].toLowerCase() !== 'bearer'){
            return res.unauthorized()
        }

        const token = parts[1]
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        console.log("AUTH MW ERROR :: ", error)
        return res.unauthorized()
    }
}
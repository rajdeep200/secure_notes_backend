import type { Request, Response, NextFunction } from 'express'

declare module 'express-serve-static-core' {
    interface Response {
        ok<T>(msg: string, data?: T, extra?: Record<string, unknown>): this;
        created<T>(msg: string, data?: T, extra?: Record<string, unknown>): this;
        error(status: number, msg: string, extra?: Record<string, unknown>): this;
        unauthorized(msg?: string, extra?: Record<string, unknown>): this;
        badRequest(msg?: string, extra?: Record<string, unknown>): this;
        conflict(msg?: string, extra?: Record<string, unknown>): this;
        serverError(msg?: string, extra?: Record<string, unknown>): this;
    }
}

export function responseMw(){
    return (req: Request, res: Response, next: NextFunction) => {
        res.ok = function(msg, data, extra={}){
            return this.status(200).json({ok: true, msg, data, ...extra})
        }
        res.created = function (msg, data, extra={}) {
            return this.status(201).json({ok: true, msg, data, ...extra})
        }
        res.error = function (status, msg, extra={}) {
            return this.status(status).json({ok: false, msg, ...extra})
        }
        res.unauthorized = function (msg='Unauthorized', extra={}) {
            return this.status(401).json({ok: false, msg, ...extra})
        }
        res.badRequest = function (msg='Bad Request', extra={}) {
            return this.status(400).json({ok: false, msg, ...extra})
        }
        res.conflict = function (msg='Conflict', extra={}) {
            return this.status(409).json({ok: false, msg, ...extra})
        }
        res.serverError = function (msg='Something went wrong...', extra={}) {
            return this.status(500).json({ok: false, msg, ...extra})
        }


        next()
    }
}
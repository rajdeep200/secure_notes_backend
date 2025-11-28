import fs from 'fs'
import https from 'https'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { responseMw } from "./shared/lib/respond";
import dotenv from 'dotenv'
import { connectDB } from './shared/config/db'
dotenv.config()
connectDB()

import authRouter from './modules/auth/routes'
import notesRouter from './modules/notes/routers'

const app = express()
const PORT = process.env.PORT || 5050

//Helmet usage
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "connect-src": ["'self'"]
        }
    },
    hsts: {
        maxAge: 15552000
    }
}))

app.use(express.json({limit: '100kb'}))
app.use(cors({
    origin: 'https://localhost:8080',
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}))
app.use(cookieParser())
app.use(responseMw())

app.use('/api', authRouter)
app.use('/api/notes', notesRouter)

const key = fs.readFileSync('./localhost-key.pem')
const cert = fs.readFileSync('./localhost.pem')

https.createServer({key, cert}, app).listen(PORT, () => {
    console.log(`Secure server is running at https://localhost:${PORT}`)
})
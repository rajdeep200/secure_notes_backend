import express from 'express'
import { createNote } from './controllers'
import { authMW } from '../../shared/middlewares/authMiddleware'

const router = express.Router()

router.post('/', authMW, createNote)

export default router
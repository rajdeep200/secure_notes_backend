import express from 'express'
import { createNote } from '../controllers/notesController'
import { authMW } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/', authMW, createNote)

export default router
import type {Request, Response} from 'express'
import * as z from 'zod';
import { Note } from './models/Notes.model';

export const CreateNoteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(50_000),
  tags: z.array(z.string().trim().min(1).max(24)).max(10).optional(),
  pinned: z.boolean().optional(),
  idempotencyKey: z.string().trim().max(64).optional()
});

export const createNote = async (req: Request, res: Response) => {
    try {
        const parsedObj = CreateNoteSchema.parse(req.body)
        const { title, content, tags = [], pinned = false } = parsedObj;
        // @ts-ignore
        const userId = req.user.sub;
        const savedNote = await Note.create({
            userId: userId,
            title, content, tags, pinned
        })
        return res.created('Note created', savedNote)
    } catch (error) {
        console.log('createNote ERROR ::', error)
        return res.serverError()
    }
}
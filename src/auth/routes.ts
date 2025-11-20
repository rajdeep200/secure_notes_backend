import express from 'express'
import * as zod from 'zod'
import { User } from '../models/User.model'
import { hashPassword, verifyPassword } from './password'
import { generateToken } from './tokens'

const router = express.Router()

const LoginSchema = zod.union([
    zod.object({
        email: zod.email(),
        password: zod.string().min(8)
    }),
    zod.object({
        username: zod.string(),
        password: zod.string().min(8)
    })
])

const buildQuery = (input: zod.infer<typeof LoginSchema>) => {
    if ('email' in input) {
        return { email: input.email.trim().toLowerCase() }
    }
    return { username: input.username.trim().toLowerCase() }
}

router.post('/login', async (req, res) => {
    try {

        let parsedUserObj = LoginSchema.parse(req.body)
        const query = buildQuery(parsedUserObj)
        console.log('query =>', query)
        const savedUser = await User.findOne(query)
        console.log('savedUser =>', savedUser)
        if (!savedUser) {
            return res.badRequest('User not found')
        }
        const isValidPassword = await verifyPassword(savedUser.password, parsedUserObj.password)
        if (!isValidPassword) {
            return res.unauthorized()
        }
        const token = generateToken(savedUser._id)
        if (isValidPassword) {
            return res.ok('Logged In', { id: savedUser._id, email: savedUser.email, username: savedUser.username }, { token })
        } else {
            return res.unauthorized()
        }
    } catch (error) {
        console.log("Login Error :: ", error)
        return res.serverError()
    }
})

const RegistrationSchema = zod.object({
    username: zod.string(),
    email: zod.email(),
    password: zod.string()
})
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const userObj = RegistrationSchema.parse({ username, email, password })
        const hashedPassword = await hashPassword(password)
        const savedUser = await User.create({ ...userObj, password: hashedPassword })
        const token = generateToken(savedUser._id)
        return res.created('User created', null, { token })
    } catch (error) {
        console.log('Something went wrong :: ', error)
        return res.serverError()
    }
})

export default router
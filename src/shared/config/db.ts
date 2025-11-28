import mongoose from 'mongoose'

export async function connectDB() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || ''
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.log("DB Connection error", error)
    }
}
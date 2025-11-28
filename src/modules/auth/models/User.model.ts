import mongoose from 'mongoose'
const {Schema} = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, {timestamps: true})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
import mongoose from 'mongoose'
const {Schema} = mongoose

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        maxLength: 120,
        minLength: 3,
        default: 'Untitled'
    },
    content: {
        type: String,
        maxLength: 50000,
        minLength: 3,
        required: true
    },
    tags: {
        type: [String]
    },
    pinned: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    text: {
        type: String
    },
    urls: [{
        type: String
    }],
    edited: {
        type: Boolean,
        default: false
    },
    seened: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', schema)
module.exports = Message
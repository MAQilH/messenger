const mongoose = require('mongoose')
const Schema = mongoose.Schema


const schema = new Schema({
    firstUserId: Schema.Types.ObjectId,
    secUserId: Schema.Types.ObjectId,
    totalMessageNumber: {
        type: Schema.Types.Number,
        default: 0
    }, 
    seenedNumbers: {
        type: Schema.Types.Mixed,
        default: {} 
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation', schema)
module.exports = Conversation
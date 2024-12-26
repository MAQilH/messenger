const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }, 
        password: {
            type: String,
            required: true
        }, 
        lastSeen: {
            type: Date
        }, 
        online: {
            type: Boolean,
            default: false
        },
        imgUrl: {
            type: String
        },
        joinedConversations: [{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    }, {
        timestamps: true
    }
)

const User = mongoose.model('User', schema)
module.exports = User
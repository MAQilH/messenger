const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    socketId: {
        type: String,
        require: true
    }, 
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        unique: true
    }
}, {
    timestamps: true
})

const UserSocketId = mongoose.model('UserSocketId', schema)

module.exports = UserSocketId
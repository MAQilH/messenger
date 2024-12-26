const mongoose = require("mongoose");
const User = require("./model/User");
const UserSocketId = require("./model/UserSocketId");
const Conversation = require("./model/Conversation");
const Message = require("./model/Message");
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3ovc5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`

console.log('aqiiil', uri)

class Database {
  async _connectDB() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB Atlas with Mongoose!");
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
    }
  }
  async findUserByUsername(username) {
    return await User.findOne({ username }) 
  }
  async findUserById(id, opt) {
    console.log('find user by id', id)
    if(opt) return await User.findById(id, opt)
    return await User.findById(id)
  }
  async addNewUser(username, email, password) {
    try {
      const newUser = new User({
        username,
        email,
        password,
        lastSeen: new Date(),
      });
      await newUser.save();
    } catch (err) {
        console.log(err)
    }
  }
  async searchUsersByUsername(searchInput) {
    const usernameRegex = new RegExp(`^${searchInput}`, 'i');
    return await User.find({username: usernameRegex}, 'username imgUrl lastSeen').exec()
  }

  async setUserSocketId(userId, socketId) {
    try { 
      // console.log(await UserSocketId.find({}).exec())
      const userSocketId = await UserSocketId.findOne({userId: userId})
      if(!userSocketId) {
        await new UserSocketId({
          userId, socketId
        }).save()
        console.log('user socket created!')
      } else {
        await UserSocketId.findByIdAndUpdate(userSocketId._id, {
          $set: {
            socketId
          }
        }, {new: true})
        console.log('user socket updated!')
      }
    } catch (err) {
      console.log(err)
    }    
  }   

  async getSocketFromUserSocketId(userId) {
    try {
      const userSocketId = await UserSocketId.findOne({userId}, 'socketId')
      if(!userSocketId) return null
      return userSocketId.socketId
    } catch (err) {
      console.log(err)
    }
  }

  async removeUserSocketId(socketId) {
    try{
      const deleted = await UserSocketId.findOneAndDelete({socketId})
      if(deleted) return true
      return false
    } catch {
      return false
    }
  }

  async getConverstionIdWithUsers(firstUserId, secUserId) {
    try {
      const conversation = await Conversation.findOne({firstUserId, secUserId})
      if(!conversation) return null
      return conversation._id
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async getContactIdInConversation(conversationId, userId) {
    try {
      const conversation = await this.findConversationById(conversationId)
      if(!conversation) return null
      return conversation.firstUserId.toString() === userId.toString()? conversation.secUserId: conversation.firstUserId
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async createNewConversation(firstUserId, secUserId) {
    try {
      const newConversation = {
        firstUserId, 
        secUserId,
        seenedNumbers: {}
      }
      newConversation.seenedNumbers[firstUserId] = 0
      newConversation.seenedNumbers[secUserId] = 0

      const conversation = await new Conversation(newConversation).save()
      return conversation
    } catch (err){
      console.log(err)
      return null
    }
  }
  
  async addMessageToConversation(conversationId, message) {
    try {
      if(!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new Error('Invalid conversation ID');
      }
      const update = {
        $push: { messages: message._id },
        $inc: { totalMessageNumber: 1 } 
      }
      update.$inc[`seenedNumbers.${message.senderId}`] = 1
      const result = await Conversation.findOneAndUpdate(
        { _id: conversationId }, 
        update,
        { new: true, useFindAndModify: false }
      );
    }catch (err) {
      console.log('Error adding message:', err);
    }
  }

  async addConversationToUser(conversationId, userId) {
    try {
      const newUser = await User.findByIdAndUpdate(userId, {
        $push: {
          joinedConversations:  conversationId
        }
      }, { 
        new: true,
        useFindAndModify: false
      })
      return newUser
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async createNewMessage(senderId, conversationId, text, urls) {
    try {
      const newMessage = new Message({
        senderId, conversationId, text, urls
      })
      const res = await newMessage.save()
      return res
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async findConversationById(conversationId) {
    try {
      console.log('find conversation', conversationId)
      return await Conversation.findById(conversationId)
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async loadUnseenMessages(conversationId) {
    try {
      const conversation = await this.findConversationById(conversationId)
      const unseenMessages = await Message.find({
        _id: {
          $in: conversation.messages 
        },
        seened: false
      })
      return unseenMessages
    } catch(err) {
      console.error(err)
      return null
    }
  }
  
  async loadTopMessage(conversationId, beginMessageId, numberOfLoadMessage) {
    try {
      const conversation = await this.findConversationById(conversationId)
      let afterBeginMessageIndex = conversation.messages.length
      console.log(afterBeginMessageIndex)
      if(beginMessageId) {
        afterBeginMessageIndex = conversation.messages.findIndex(messageId => {
          return messageId.toString() === beginMessageId.toString()
        })
      }
      if(!numberOfLoadMessage) numberOfLoadMessage = 1
      
      const startMessageIndex = Math.max(0, afterBeginMessageIndex - numberOfLoadMessage)
      if(startMessageIndex == afterBeginMessageIndex) return []
      const loadMessageIds = conversation.messages.slice(startMessageIndex, afterBeginMessageIndex)
      const messages = await Message.find({
        _id: {
          $in: loadMessageIds
        }
      })
      return messages
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async loadTopMessage(conversationId, beginMessageId, numberOfLoadMessage) {
    try {
      const conversation = await this.findConversationById(conversationId)
      let afterBeginMessageIndex = conversation.messages.length
      console.log(afterBeginMessageIndex)
      if(beginMessageId) {
        afterBeginMessageIndex = conversation.messages.findIndex(messageId => {
          return messageId.toString() === beginMessageId.toString()
        })
      }
      if(!numberOfLoadMessage) numberOfLoadMessage = 1
      
      const startMessageIndex = Math.max(0, afterBeginMessageIndex - numberOfLoadMessage)
      if(startMessageIndex == afterBeginMessageIndex) return []
      const loadMessageIds = conversation.messages.slice(startMessageIndex, afterBeginMessageIndex)
      const messages = await Message.find({
        _id: {
          $in: loadMessageIds
        }
      })
      return messages
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async loadUpMessage(conversationId, beginMessageId, numberOfLoadMessage) {
    try {
      const conversation = await this.findConversationById(conversationId)
      let afterBeginMessageIndex = conversation.messages.length
      if(beginMessageId) {
        afterBeginMessageIndex = conversation.messages.findIndex(messageId => {
          return messageId.toString() === beginMessageId.toString()
        })
      }
      if(!numberOfLoadMessage) numberOfLoadMessage = 1
      
      const startMessageIndex = Math.max(0, afterBeginMessageIndex - numberOfLoadMessage)
      if(startMessageIndex === afterBeginMessageIndex) return []
      const loadMessageIds = conversation.messages.slice(startMessageIndex, afterBeginMessageIndex)
      const messages = await Message.find({
        _id: {
          $in: loadMessageIds
        }
      })
      return messages
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async loadDownMessage(conversationId, beginMessageId, numberOfLoadMessage) {
    try {
      const conversation = await this.findConversationById(conversationId)
      let afterBeginMessageIndex = conversation.messages.length
      if(beginMessageId) {
        afterBeginMessageIndex = conversation.messages.findIndex(messageId => {
          return messageId.toString() === beginMessageId.toString()
        })
      }
      if(!numberOfLoadMessage) numberOfLoadMessage = 1
      
      const startMessageIndex = afterBeginMessageIndex + 1
      const endMessageIndex = Math.min(
        conversation.messages.length, 
        afterBeginMessageIndex + numberOfLoadMessage + 1
      )

      if(startMessageIndex >= endMessageIndex) return []
      const loadMessageIds = conversation.messages.slice(startMessageIndex, endMessageIndex)
      const messages = await Message.find({
        _id: {
          $in: loadMessageIds
        }
      })
      return messages
    } catch(err) {
      console.error(err);
      return null
    }
  }



  async findMessageById(messageId) {
    try {
      return await Message.findById(messageId)
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async updateSeenMessage(messageId, seenStatus, userId) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(messageId, {
        $set: {
          seened: seenStatus
        }
      }, { new: true })
      console.log('update seen message', updatedMessage)
      const conversation = await Conversation.findById(updatedMessage.conversationId)
      if(conversation.seenedNumbers[userId.toString()] < conversation.totalMessageNumber) {
        const update = {
          $inc: {}
        }
        update.$inc[`seenedNumbers.${userId}`] = seenStatus? 1: 0
        console.log('update user converstion total seened message number', update)
        await Conversation.findByIdAndUpdate(
          { _id: updatedMessage.conversationId },
          update,
          { new: true }
        )
      } else if(conversation.seenedNumbers[userId.toString()] > conversation.totalMessageNumber){
        const update = {
          $set: {}
        }
        update.$set[`seenedNumbers.${userId}`] = conversation.totalMessageNumber
        await Conversation.findByIdAndUpdate(
          { _id: updatedMessage.conversationId },
          update,
          { new: true }
        )
        console.log('update incorrect conversation total message', update)
      }
      return updatedMessage
    } catch(err) {
      console.error(err);
      return null
    }
  } 

  async updateUserLastSeen(userId, lastSeen) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: {
          lastSeen
        }
      }, { new: true })
      return updatedUser
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async getUserContacts(userId) {
    try {
      const user = await User.findById(userId, 'joinedConversations username')
      const conversationIds = user.joinedConversations
      const contacts = []
      const promises = conversationIds.map(conversationId => new Promise(async (resolve, reject) => {
        const conversation = await this.findConversationById(conversationId)
        if(!conversation) {
          resolve()
          return
        }
        const contactId = userId.toString() === conversation.firstUserId.toString()? conversation.secUserId: conversation.firstUserId
        const contact = await User.findById(contactId, 'username lastSeen imgUrl')
        if(!contact) {
          resolve()
          return
        }
        const lastMessageId = conversation.messages[conversation.messages.length - 1]
        const lastMessage = await this.findMessageById(lastMessageId)
        contacts.push({
          _id: contact._id,
          username: contact.username,
          lastSeen: contact.lastSeen,
          conversationId,
          lastMessage,
          unseen: conversation.totalMessageNumber - (conversation.seenedNumbers[userId] ?? 0)
        })
        resolve()
      }))
      await Promise.all(promises)
      contacts.sort((contact1, contact2) => {
        if(!contact1.lastMessage) return 1
        if(!contact2.lastMessage) return -1
        return contact1.lastMessage.createdAt.getTime() < contact2.lastMessage.createdAt.getTime()? 1: -1
      })
      return contacts
    } catch (err) {
      console.log(err)
    }
  }
}

const database = new Database()
database._connectDB()

module.exports = database

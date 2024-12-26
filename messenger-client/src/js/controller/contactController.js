import ContactView from "../view/contactView"
import UserCardController from "./userCardController"

class ContactController {
    _contactView
    _contactsControllerByUserId = {}
    _contactsControllerByConversationId = {}

    init(parent) {
        this._contactView = new ContactView()
        this._contactView.render(parent)    
    }

    newMessageAdded(data) {
        const controller = this._contactsControllerByConversationId[data.conversationId]
        controller.updateNewMassage(data)
    }

    showUserContacts(data) {
        this.clearContacts()
        data.forEach(contactData => this.insertContact(contactData))
    }

    insertContact(contactData) {
        console.log(contactData)
        const userCardController = new UserCardController()
        userCardController.init(this._contactView._contactBody, contactData)
        
        this._contactsControllerByUserId[contactData._id] = userCardController
        this._contactsControllerByConversationId[contactData.conversationId] = userCardController
    }

    updateContactStatus(data) {
        console.log(data)
        const {contactId} = data
        const controller = this._contactsControllerByUserId[contactId]
        if(!controller) return
        controller.updateContactStatus(data)
    }

    updateConversationStatus(data) {
        const {conversationId} = data
        const controller = this._contactsControllerByConversationId[conversationId]
        console.log(data, conversationId, this._contactsController, controller)
        if(!controller) return
        controller.updateContactStatus(data)
    }

    increaseUnseenMessageNumber(conversationId, incNumber) {
        const controller = this._contactsControllerByConversationId[conversationId]
        controller.increaseUnseenMessageNumber(incNumber)
    }

    hide() {
        this._contactView.hide()
    }

    show() {
        this._contactView.show()
    }

    clearContacts() {
        this._contactView.clearContacts()
    }

    updateViewActiveState(active) {
        if(active) this._contactView.active()
        else this._contactView.deactive()
    }

    close() {
        this._contactView.close()
    }
}

export default ContactController
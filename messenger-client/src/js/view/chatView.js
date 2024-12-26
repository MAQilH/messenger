import sendIcon from '../../img/send-icon.png'
import documentIcon from '../../img/document-icon.png'
import manIcon from '../../img/man.png'
import menuIcon from '../../img/menu-icon.png'
import utils from '../../util'
import backIcon from '../../img/back-icon.png'

class ChatView {
    _parent
    _chat
    _chatHeader
    _chatBody
    _chatBar
    _documentBtn
    _sendBtn
    _chatInput
    _contactName
    _contactImg
    _backBtn

    render(parent, data) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup(data))
        
        this._chat = this._parent.querySelector('.chat-container')
        this._chatHeader = this._chat.querySelector('.chat__header')
        this._chatBody = this._chat.querySelector('.chat__body')
        this._chatBar = this._chat.querySelector('.chat__bar')
        this._documentBtn = this._chatBar.querySelector('.document-icon')
        this._sendBtn = this._chatBar.querySelector('.send-icon')
        this._chatInput = this._chatBar.querySelector('.chat__input')
        this._contactStatus = this._chatHeader.querySelector('.contact-status')
        this._contactName = this._chatHeader.querySelector('.contact-name')
        this._contactImg = this._chatHeader.querySelector('.contact__img')
        this._backBtn = this._chatHeader.querySelector('.back-btn')
        
        if(data) this.fillContactStatus(data)
    }

    _generateMarkup(data) {
        return  `
            <div class="chat-container --deactive">
                <div class="chat__header">
                    <div class="chat__header">
                        <div class="contact-info">
                            <img class="contact__img" src="${manIcon}" alt="">
                            <div class="contact-detail">
                                <p class="contact-name">...</p>
                                <p class="contact-status"></p>
                            </div>
                        </div>
                        <img src="${backIcon}" class="back-btn menu-icon icon">
                    </div>
                </div>
                <div class="chat__body">
                    
                </div>
                <div class="chat__bar">
                    <input type="file" id="message-document-input" alt="document icon" class="document-icon icon">
                    <label for="message-document-input" class="document-label">

                    </label>
                    <input type="text" class="chat__input" placeholder="type...">
                    <img src="${sendIcon}" alt="send icon" class="send-icon icon">
                </div>
            </div>
        `
    }

    updateContactData(data) {
        if(data.imgUrl) this._contactImg.src = data.imgUrl 
        if(data.username) this._contactName.innerHTML = data.username
    }

    fillContactStatus(data) {
        console.log(data, this._contactStatus)
        this._contactStatus.classList.remove('--green-color')
        this._contactStatus.classList.remove('--blue-color')
        if(data.typeingStatus) {
            this._contactStatus.innerHTML = 'is typeing...'
            this._contactStatus.classList.add('--blue-color')
            return
        } 
        console.log(data)
        if(data.online) {
            this._contactStatus.innerHTML = 'online'
            this._contactStatus.classList.add('--green-color')
        } else {
            this._contactStatus.innerHTML = utils.converTimeStrToHourAndMin(data.lastSeen)
        }
    }

    showIsTypeingInHeader() {
        this._contactStatus.innerHTML = 'is typing...'
    }

    showLastSeenInHeader(date) {
        this._contactStatus.innerHTML = utils.converTimeStrToHourAndMin(date)
    }

    getChatBody() {
        return this._chatBody
    }

    addInputChangeHandler(handler) {
        this._chatInput.addEventListener('input', handler)
    }

    fillSendData(handler) {

        const chatMessage = this._chatInput.value
        // TODO: already this function handle sending only one image
        let files = []
        {[...this._documentBtn.files].forEach(file => {
            if(!file) return
            const reader = new FileReader()
            reader.onload = () => {
                const arrayBuffer = reader.result
                files.push(arrayBuffer)
                handler({text: chatMessage, files})
            }
            reader.readAsArrayBuffer(file)
        })}
        if(![...this._documentBtn.files].length) {
            handler({text: chatMessage, files})
        }
    }


    resetSendData() {
        this._chatInput.value = ''
        this._documentBtn.value = ''
    }

    addSendHandler(handler) {
        this._sendBtn.addEventListener('click', function(){
            if(this._chatInput.value) {
                this.fillSendData(handler)
                this.resetSendData()
            }
        }.bind(this))
        this._chatInput.addEventListener('keydown', function(event) {
            if(event.key === 'Enter' && this._chatInput.value) {
                this.fillSendData(handler)
                this.resetSendData()
            }
        }.bind(this))
    }

    addDocumentHandler(handler) {
        this._documentBtn.addEventListener('click', handler)
    }

    addBackHandler(handler) {
        this._backBtn.addEventListener('click', handler)
    }

    deactive() {
        this._chat.classList.add('--deactive')
    }

    active() {
        console.log('remove deactive label')
        this._chat.classList.remove('--deactive')
    }

    close() {
        this._parent.removeChild(this._chat)
    }
}

export default ChatView
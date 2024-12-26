import manIcon from '../../img/man.png'
import utils from '../../util'

class UserCardView {
    _parent
    _card
    _data
    _cardImg
    _cardName

    render(parent, data) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup(data))
        this._card = this._parent.lastElementChild
        this._cardImg = this._card.querySelector('.user-card__img')
        this._cardName = this._card.querySelector('.user-card-name')
        this._cardOnline = this._card.querySelector('.user-card__online')
        this._cardLastMessage = this._card.querySelector('.user-card__message')
        this._cardLastMessageDate = this._card.querySelector('.user-card__last-message-date')
        this._cardIsTypeing = this._card.querySelector('.user-card__is-typeing')
        this._userCardBadage = this._card.querySelector('.user-card__badage')
        this._userCardBadageValue = this._card.querySelector('.user-card__badage-value')
        this.fillMarkup(data)
    }

    addCardClickHandler(handler) {
        this._card.addEventListener('click', handler)
    }

    getCardId() {
        return {
            userId: this._card.dataset.userId,
            conversationId: this._card.dataset.conversationId
        }
    }

    _generateMarkup(data) {
        return `
            <div class="user-card">
                <div class="user-card__img-container">
                    <img src="${manIcon}" alt="user image" class="user-card__img">
                    <div class="user-card__online ${data.online? '': 'hidden'}"></div>
                </div>
                <div class="user-card-detail">
                    <p class="user-card-name">${data.username ?? ''}</p>
                    <p class="user-card__message">${data.lastMessage? data.lastMessage.text: ''}</p>
                    <p class="user-card__is-typeing hidden">is typeing...</p>
                </div>
                <div class="user-card__message-detail">
                    <span class="user-card__last-message-date">${data.lastMessage?.createdAt ?? ''}</span>
                    <div class="user-card__badage ${data.unseenMessageNumber? '': 'hidden'}"><span class="user-card__badage-value">${data.unseenMessageNumber ?? ''}</span></div>
                </div>
            </div>
        `
    }

    fillMarkup(data) {
        this._data = data
        this._card.setAttribute('data-conversation-id', data.conversationId ?? '')
        this._card.setAttribute('data-user-id', data._id ?? data.conversationId ?? '')
        this._cardImg.src = data.imgUrl? data.imgUrl: manIcon
        this._cardName.innerHTML = data?.username
        this.updateLastMessage(data, false)
        this.fillStatus(data)
    }

    updateLastMessage(data, isNewMessage = true) {
        console.log(data)
        this._userCardBadage.classList.add('hidden')
        this._cardLastMessage.innerHTML = data.lastMessage? data.lastMessage.text: ''
        this._cardLastMessageDate.innerHTML = data.lastMessage? utils.converTimeStrToHourAndMin(data.lastMessage.createdAt): ''
        if('unseen' in data) this.updateUnseenMessageNumber(data.unseen)
        else this.increaseUnseenMessageNumber(isNewMessage)
    }

    updateUnseenMessageNumber(unseenNumber) {
        if(unseenNumber) {
            this._data.unseen = unseenNumber
            this._userCardBadage.classList.remove('hidden')
        } else {
            this._data.unseen = 0
            this._userCardBadage.classList.add('hidden')
        }
        this._userCardBadageValue.innerHTML = this._data.unseen
    }

    increaseUnseenMessageNumber(inc) {
        this.updateUnseenMessageNumber((this._data.unseen ?? 0)  + inc)
    }

    fillStatus(data) {
        if(data.online) {
            this._cardOnline.classList.remove('hidden')
        } else {
            this._cardOnline.classList.add('hidden')
        }
        if('typeingStatus' in data) {
            if(data.typeingStatus) {
                this._cardIsTypeing.classList.remove('hidden')
                this._cardLastMessage.classList.add('hidden')
            } else {
                this._cardIsTypeing.classList.add('hidden')
                this._cardLastMessage.classList.remove('hidden')
            }
        }
    }

    moveToBeginOfParent() {
        this.close()
        this._parent.insertAdjacentElement('afterbegin', this._card)
    }

    close() {
        this._parent.removeChild(this._card)
    }
}

export default UserCardView
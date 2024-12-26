import SyncIcon from '../../img/sync-icon.png'
import SeenIcon from '../../img/seen-icon.png'
import UnseenIcon from '../../img/unseen-icon.png'
import utils from '../../util'

class MessageView {
    _parent
    _data
    _message
    _statusIcon

    render(parent, data, fromMe) {
        this._parent = parent
        this._data = data
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup(data, fromMe))
        this._message = this._parent.lastElementChild
        if(fromMe)
            this._statusIcon = this._message.querySelector('.status-icon')
    }

    _generateMarkup(data, fromMe) {
        let imageMarkup = data.urls? data.urls.map(imageUrl => {
            return `
            <img src="${imageUrl}" alt="" class="chat__message-image">
            `
        }).join() : ''

        let icon
        if(data.seened == undefined) icon = SyncIcon
        else if(data.seened) icon = SeenIcon
        else icon = UnseenIcon

        return `
            <div class="chat__message chat__message--${fromMe? 'self': 'other'}" data-id="${data._id}">
                ${imageMarkup}
                <p class="chat__message__text">
                    ${data.text}
                </p>
                <div class="chat__message-detail">
                    <sapn class="chat__message__date">${utils.converTimeStrToHourAndMin(data.createdAt)}</sapn>
                    ${fromMe? `<img src="${icon}" class="status-icon icon">`: ''}
                </div>
            </div>
        `
    }

    

    rerender(data, fromMe) {
        console.log('data in rerender', data)
        const markup = this._generateMarkup(data, fromMe)
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = markup
        const component = tmpDiv.firstElementChild
        this._parent.replaceChild(component, this._message)
        this._message = component
    }

    changeStatusToUnseen() {
        this._statusIcon.src = UnseenIcon
    }

    changeStatusToSeen() {
        this._statusIcon.src = SeenIcon
    } 

    close() {
        this._parent.removeChild(this._message)
    }
}

export default MessageView

class EmptyChatView {
    page

    render(parent) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup())
        
        this.page = this._parent.querySelector('.empty-chat-container')
    }

    _generateMarkup() {
        return `
            <div class="empty-chat-container --deactive">
                <div class="message-card">
                    <h4>Select a chat to start messaging</h4>
                </div>
            </div>
        `
    }

    deactive() {
        this.page.classList.add('--deactive')
    }

    active() {
        this.page.classList.remove('--deactive')
    }

    close() {
        this._parent.removeChild(this.page)
    }
}

export default EmptyChatView

class MainView {
    _parent
    contactContainer
    chatContainer
    main

    render(parent) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup())
        
        this.main = this._parent.querySelector('.main')
    }

    _generateMarkup() {
        return `
            <div class="main">
            </div>
        `
    }

    close() {
        this._parent.removeChild(this.main)
    }
}

export default MainView
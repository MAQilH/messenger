import menuIcon from '../../img/menu-icon.png'
import searchIcon from '../../img/search-icon.png'

class ContactView {
    _parent
    _searchIcon
    _menuIcon
    _contact
    _contactBody

    render(parent) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup())

        this._contact = this._parent.querySelector('.contact-container')
        this._searchIcon = this._parent.querySelector('.search-icon')
        this._menuIcon = this._parent.querySelector('.menu-icon')
        this._contactBody = this._parent.querySelector('.contact__body')
    }

    addSearchClickHandler(handler) {
        this._searchIcon.addEventListener('click', handler)
    }

    addMenuClickHandler(handler) {
        this._menuIcon.addEventListener('click', handler)
    }

    _generateMarkup() {
        return  `
            <div class="contact-container">
                <div class="contact__header">
                    <img src="${menuIcon}" class="menu-icon icon">
                    <img src="${searchIcon}" class="search-icon icon">
                </div>
                <div class="contact__body">

                </div>
            </div>
        `
    }

    clearContacts() {
        this._contactBody.innerHTML = ''
    }

    hide() {
        this._contact.classList.add('hidden')
    }

    deactive() {
        this._contact.classList.add('--deactive')
    }

    active() {
        this._contact.classList.remove('--deactive')
    }

    show() {
        this._contact.classList.remove('hidden')
    }

    close() {
        this._parent.removeChild(this._contact)
    }
}

export default ContactView
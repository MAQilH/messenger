import closeIcon from '../../img/close-icon.png'

class SearchView {
    _parent
    _closeBtn
    _searchInput
    _search_body

    search

    render(parent) {
        this._parent = parent

        this._parent.insertAdjacentHTML('afterbegin', this._generateMarkup())
        this.search = this._parent.querySelector('.search-container')
        this._closeBtn = this.search.querySelector('.search__close-btn')
        this._searchInput = this.search.querySelector('.search__input')
        this._search_body = this.search.querySelector('.search__body')
    }

    addCloseHandler(handler) {
        this._closeBtn.addEventListener('click', handler)
    }

    addChangeSearchInputHandler(handler) {
        this._searchInput.addEventListener('input', handler)
    } 

    clearSearchBody() {
        this._search_body.innerHTML = ''
    }

    _generateMarkup() {
        return `
            <div class="search-container">
                <div class="search__header">
                    <input type="text" class="search__input" placeholder="search....">
                    <img class="search__close-btn" src="${closeIcon}"></button>
                </div>
                <div class="search__body">
                </div>
            </div>
        `
    }

    deactive() {
        this.search.classList.add('--deactive')
    }

    active() {
        this.search.classList.remove('--deactive')
    }

    close() {
        this._parent.removeChild(this.search)
    }
}

export default SearchView
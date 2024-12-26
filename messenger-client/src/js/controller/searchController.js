import app from "../app"
import SearchView from "../view/searchView"
import UserCardController from "./userCardController"

class SearchController {
    _searchView 
    lastSearchTimeout = null

    init(parent) {
        this._searchView = new SearchView()
        this._searchView.render(parent)

        this._searchView.addChangeSearchInputHandler(this.changeSearchInput.bind(this))
    }

    changeSearchInput(event) {
        const searchQuery = event.target.value
        if(!this.lastSearchTimeout) {
            this.lastSearchTimeout = setTimeout(async function() {
                if(!searchQuery) this.displaySearchResult([])
                else this.searchUsers(searchQuery)
                this.lastSearchTimeout = null
            }.bind(this), 1000)
        }
    }

    searchUsers(searchQuery) {
        app.bridge.searchUsers(searchQuery, this.displaySearchResult.bind(this))
    }

    displaySearchResult(users) {
        this._searchView.clearSearchBody()
        users.forEach(userData => this.insertNewUserSearchCard(userData));
    }

    insertNewUserSearchCard(userData) {
        const controller = new UserCardController()
        controller.init(this._searchView._search_body, userData)
    }

    updateViewActiveState(active) {
        if(active) this._searchView.active()
        else this._searchView.deactive()
    }

    close() {
        this._searchView.close()
    }
}

export default SearchController
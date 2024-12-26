import EmptyChatView from "../view/emptyChatView"

class EmptyChatController {
    _emptyChatView
    init(parent) {
        this._emptyChatView = new EmptyChatView()
        this._emptyChatView.render(parent)
    }

    updateViewActiveState(active) {
        if(active) this._emptyChatView.active()
        else this._emptyChatView.deactive()
    }

    close() {
        this._emptyChatView.close()
    }    
}

export default EmptyChatController
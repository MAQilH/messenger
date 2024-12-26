class Event {
    subscribers
    constructor() {
        this.subscribers = []
    }
    addSubscriber(handler) {
        this.subscribers.push(handler)
    }
    removeSubscriber(handler) {
        this.subscribers.splice(
            this.subscribers.find(handler), 1
        )
    }
    emit(data) {
        this.subscribers.forEach(subscriber => subscriber(data))
    }
}

export default Event
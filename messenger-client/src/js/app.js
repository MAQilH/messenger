import SocktBridge from './socketBridge'

class App {
    chatController
    constructor() {
        this.bridge = new SocktBridge()
    }
}

const app = new App()

export default app
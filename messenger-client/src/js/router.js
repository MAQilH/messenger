import RegisterController from "./controller/registerController"
import LoginController from "./controller/loginController"
import MainController from "./controller/mainController"
import api from "./api"

class Router {
    _currentController
    path = {
        '/register': {
            controller: RegisterController,
            needAuth: false 
        },
        '/login': {
            controller: LoginController,
            needAuth: false
        },
        '/': {
            controller: MainController,
            needAuth: true
        }
    }

    init() {
        window.addEventListener('hashchange', this.routHandler.bind(this))
        window.addEventListener('load', this.routHandler.bind(this))
    }

    async routHandler() {
        const pathname = window.location.pathname

        let component = this.path[pathname]
        if(!component) {
            this.redirect('/login')
            return
        }
        
        if(component.needAuth) {
            if(!(await api.verifyToken())) {
                this.redirect('/login')
                return
            }
        }

        if(this._currentController) this._currentController.close()
        this._currentController = new component.controller()
        this._currentController.init()
    }    

    redirect(url) {
        window.history.replaceState({ page: 'new-page' }, 'New Page Title', url);
        this.routHandler()
    } 
}

const router = new Router()
router.init()

export default router
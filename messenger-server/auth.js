const jwt = require('jsonwebtoken');
const database = require('./database')
const secretKey = process.env.SECRET_KEY


class Authentication {
    generateJsonWebToken(userId) {
        const options = {
            expiresIn: '1h'
        }
        const token = jwt.sign({userId}, secretKey, options)
        return token
    }

    getUserIdFromToken(token) {
        if (!token) return null
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded.userId
        } catch {
            return null
        }
    }
   
    verifyToken(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ msg: 'No token provided' });
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }
            req.user = decoded;
            next();
        });
    }

    init(app) {
        app.post('/register', async (req, res) => {
            const {
                username, 
                password, 
                email
            } = req.body
            console.log(req.body)
        
            const user = await database.findUserByUsername(username)
            if(user) {
                console.log('bad')
                res.status(400).json({
                    msg: 'There exist a user with this username!'
                })
                return
            }
        
            database.addNewUser(username, email, password)
            res.status(200).json({
                msg: 'User Registered successfully'
            })
        })
        
        
        app.post('/login', async (req, res) => {
            const {
                username, password
            } = req.body
        
            const user = await database.findUserByUsername(username)
        
            if(!user) {
                res.status(404).json({
                    msg: "There isn't exist a user with this username"
                })
                return
            }
        
            if(user.password !== password) {
                res.status(401).json({
                    msg: "Username or Password is wrong!"
                })
                return
            }
        
            let newToken = this.generateJsonWebToken(user._id)
            // console.log('okkaaaaay')
        
            res.status(200).json({
                token: newToken,
                msg: "User successfully loged in"
            })
        })
        
        app.get('/verifyToken', this.verifyToken, async (req, res) => {
            res.status(200).json({
                msg: 'Token is valid!'
            })
        })
    }
}

const auth = new Authentication()

module.exports = auth
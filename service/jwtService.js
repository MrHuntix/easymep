let jwt = require('jsonwebtoken');
const _secret = process.env.SECRET_KEY;//'this_is_a_secret';

class JWTService {
    constructor() {
        console.log('JWTService initialized');
    }

    async createToken(username) {
        try {
            const token = await jwt.sign({ username }, _secret, {
                algorithm: "HS256"
            });
            console.log(`token ${token}`);
            return token;
        } catch (error) {
            console.error(error);
            return 'error while generating token';
        }

    }

    async validateToken(req, res, next) {
        try {
            let authheader = req.headers.authorization;
            console.log(`authheader ${authheader}`);
            let token = authheader && authheader.split(' ')[1];
            console.log(`token ${token}`);
            if (token == null) return res.sendStatus(401);

            let payload = await jwt.verify(token, _secret);
            console.log(`payload ${payload}`);

            if (payload != null) {
                next();
            } else {
                return res.sendStatus(401);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

}

module.exports = new JWTService();
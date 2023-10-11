const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
    
    //users token is inside header of request like below
    const authHeader = request.headers

    if(!authHeader.cookie) {
        throw new AppError('Token not informed', 401)

    }

    //so we have to split it and get only the token hash
    const [, token] = authHeader.cookie.split('token=')

    try {
        //verify is its a valid token
        const { sub: user_id } = verify(token, authConfig.jwt.secret)

        request.user = {
            id: Number(user_id)
        }

        return next()
    } catch (error) {
        throw new AppError('Invalid JWT Token', 401)
    }
}

module.exports = ensureAuthenticated
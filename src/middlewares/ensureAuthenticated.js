const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
    
    //users token is inside header of request like below
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError('Token not informed', 401)

    }
    //token comes like: Beare xxxxxxxxxxx
    //so we have to split it and get only the token hash
    const [, token] = authHeader.split(" ")

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
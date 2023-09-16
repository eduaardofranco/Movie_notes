const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body

        //create connection w/ db and return user with id passed
        const user = await knex('users').where({email}).first()

        if(!user) {
            throw new AppError('Credentials incorret', 401)
        }

        //check is password matchs
        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched) {
            throw new AppError('Credentials incorret', 401)
        }

        //jwt config from auth.js
        const { secret, expiresIn } = authConfig.jwt
        const token = sign({}, secret, {
            //subject is what we're putting inside the tokens header
            //in these case is the user id
            subject: String(user.id),
            expiresIn
        })

        return response.json({ user, token })
    }
}

module.exports = SessionsController
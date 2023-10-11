const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class UsersValidatedController {
    
    async index(request, response) {
        const { user } = request
        console.log('user id: ' +user.id)

        const checkUserExists = await knex('users').where({ id: user.id })
        console.log('checkUserExists' +checkUserExists.length)

        if(checkUserExists.length === 0) {
            throw new AppError('Unauthorized', 401)
        }


        return response.status(200).json()

    }
}

module.exports = UsersValidatedController;
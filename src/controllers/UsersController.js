const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const sqliteConnection = require('../database/sqlite')
const UserCreateService = require('../services/UserCreateService')
const UserUpdateService = require('../services/UserUpdateService')
const UserDeleteService = require('../services/UserDeleteService')

const UserRepository = require('../repositories/UserRepository')

class UsersControllers {
    
    async create(request, response) {
        const { name, email, password } = request.body

        const userRepository = new UserRepository()
        const userCreateService = new UserCreateService(userRepository)

        await userCreateService.execute({ name, email, password })


        //return a 201 created status code 
        return response.status(201).json()

    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id

        const userRepository = new UserRepository()
        const userUpdateService = new UserUpdateService(userRepository)


        await userUpdateService.execute({ user_id, name, email, password, old_password });




        return response.json()
    }
    
    async delete(request, response) {
        const { id } = request.params;

        const userRepository = new UserRepository()
        const userDeleteService = new UserDeleteService(userRepository)

        await userDeleteService.execute(id)

        return response.json()
    }
}

module.exports = UsersControllers;
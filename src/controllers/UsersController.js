const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const sqliteConnection = require('../database/sqlite')

const UserRepository = require('../repositories/UserRepository')

class UsersControllers {
    
    async create(request, response) {
        const { name, email, password } = request.body

        const userRepository = new UserRepository()

        const checkUserExists = await userRepository.findByEmail(email)

        if(checkUserExists) {
            throw new AppError("E-mail already registered");
        }

        //cryptography the password
        const hashedPassword = await hash(password, 8)

        await userRepository.create({ name, email, password: hashedPassword })

        //return a 201 created status code 
        return response.status(201).json()

    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id

        //database connection
        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
       
        if(!user) {
            throw new AppError("User not found")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        //if the user tries to update the email to an email that is already registered
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("e-mail already registered")
        }

        //if there is any new value inside name variable use it, otherwise keep the one it has
        user.name = name ?? user.name; 
        user.email = email ?? user.email;

        //if user didnt pass the old password
        if(password && !old_password) {
            throw new AppError("You need to inform the old password");
        }

        //if user informs both password
        if(password && old_password) {

            //compare old password with old password informed
            const checkOldPassword = await compare(old_password, user.password);
            
            //if does not match throw error
            if(!checkOldPassword) {
                throw new AppError("Old password incorret");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, user_id]
        );
        return response.json()
    }
    
    async delete(request, response) {
        const { id } = request.params;

        await knex('users').where({ id }).delete();

        return response.json()
    }
}

module.exports = UsersControllers;
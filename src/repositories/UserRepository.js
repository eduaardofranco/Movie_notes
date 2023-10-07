const sqliteConnection = require('../database/sqlite')
const knex = require('knex')

class UserRepository {

    async findByEmail(email) {
        
        //stablish the connection with database
        const database = await sqliteConnection();

        //check if there is a user registred in the table with the same email it is traying to register
        const user = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        return user
    }

    async create({ name, email, password }) {

        //stablish the connection with database
        const database = await sqliteConnection();

         //insert data into the table
         const userId = await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

         return { id: userId}
    }

    async checkUserExists(user_id) {
        
        //stablish the connection with database
        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        return user
    }

    async update({ user }) {
        const {  id, name, email, password  } = user
        
        //database connection
        const database = await sqliteConnection();

        try {
             await database.run(`
                UPDATE users SET
                name = ?,
                email = ?,
                password = ?,
                updated_at = DATETIME('now')
                WHERE id = ?`,
                [name, email, password, id]
            );
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }

        return user
    }

    async delete(id) {

        const database = await sqliteConnection();

        await database.run(`
            DELETE FROM users
            WHERE id = ?`,
            [id]
        );

        return id
    }
}

module.exports = UserRepository
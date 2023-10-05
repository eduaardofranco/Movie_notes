const sqliteConnection = require('../database/sqlite')

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
}

module.exports = UserRepository
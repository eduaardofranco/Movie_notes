const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UserUpdateService {
    constructor(userRepository){
        this.userRepository = userRepository

    }

    async execute({ user_id, name, email, password, old_password }) {
        
        const user = await this.userRepository.checkUserExists(user_id)

        if(!user) {
            throw new AppError("User not found")
        }

        const userWithUpdatedEmail = await this.userRepository.findByEmail(email)

        //if the user tries to update the email to an email that is already registered
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("e-mail already registered")
        }

        // Update user information if provided, keeping previous values if not provided
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
        try {
            // Update the user in the repository
            await this.userRepository.update({user});
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    
        return user;
    }
}
module.exports = UserUpdateService
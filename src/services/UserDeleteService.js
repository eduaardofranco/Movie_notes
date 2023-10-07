
class UserDeleteService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async execute(id) {

        await this.userRepository.delete(id)
    }
}

module.exports = UserDeleteService
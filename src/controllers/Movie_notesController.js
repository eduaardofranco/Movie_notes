const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const sqliteConnection = require('../database/sqlite')

class Movie_notesController {

    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;
        console.log(user_id)

        if(rating >= 6) {
            throw new AppError('Define rating between 1 and 5')
        }

        const [note_id] = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        });
        
        const tagsInsert = tags.map(tag => {
            return {
                user_id,
                note_id,
                name: tag

            }
        })

        await knex('movie_tags').insert(tagsInsert);

        response.json()
    }

    async show(request, response) {
        const { id } = request.params;

        //return the movie note based on id from params
        const movie_note = await knex('movie_notes').where({ id }).first();
        const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name');

        return response.json({
            ...movie_note,
            tags
        })
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex('movie_notes').where({ id }).delete();

        return response.json()
    }

    async index(request, response) {
        const { user_id, title } = request.query

        const movie_notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title');

        return response.json(movie_notes);
    }
}

module.exports = Movie_notesController;
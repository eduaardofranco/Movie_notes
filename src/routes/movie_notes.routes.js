const { Router } = require('express');

const Movie_notesController = require('../controllers/Movie_notesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const movie_notesRoutes = Router();

const movie_notesController = new Movie_notesController();

movie_notesRoutes.use(ensureAuthenticated)

movie_notesRoutes.get('/', movie_notesController.index)
movie_notesRoutes.post('/', movie_notesController.create)
movie_notesRoutes.delete('/:id', movie_notesController.delete)
movie_notesRoutes.get('/:id', movie_notesController.show)

module.exports = movie_notesRoutes;
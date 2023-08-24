const { Router } = require('express');

const usersRoutes = require('./user.routes')
const movie_notesRoutes = require('./movie_notes.routes')

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/movie_notes', movie_notesRoutes);

module.exports = routes;
const { Router } = require('express');

const usersRoutes = require('./user.routes')
const movie_notesRoutes = require('./movie_notes.routes')
const sessionRouter = require('./sessions.routes')

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/movie_notes', movie_notesRoutes);
routes.use('/sessions', sessionRouter)

module.exports = routes;
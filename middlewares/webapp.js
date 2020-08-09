// Libraries
const Express = require('express')
const Router = Express.Router()

Router.get('/status', (req, res, next) => res.sendStatus(200))

module.exports = Router
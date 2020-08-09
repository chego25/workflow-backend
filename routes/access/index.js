// Libraries
const Express = require('express')
const Router = Express.Router()

Router.use('/login', require('./channels/login'))
Router.use(require('../../middlewares/token'))
Router.use('/profile', require('./channels/profile'))
Router.use('/password', require('./channels/password'))
Router.use('/logout', require('./channels/logout'))
Router.use(require('../../middlewares/result'))
Router.use(require('../../middlewares/error'))

module.exports = Router
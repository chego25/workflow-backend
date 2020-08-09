// Libraries
const Express = require('express')
const Router = Express.Router()

Router.use(require('../middlewares/parse'))
Router.use('/webapp', require('../middlewares/webapp'))
Router.use('/access', require('./access/index'))
Router.use(require('../middlewares/token'))
Router.use(require('../middlewares/profile'))
Router.use('/role', require('./role/index'))
Router.use('/user', require('./user/index'))
Router.use(require('../middlewares/not-found'))
Router.use(require('../middlewares/result'))
Router.use(require('../middlewares/error'))

module.exports = Router
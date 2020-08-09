const Express = require('express')
const Logger = require('morgan')
const Cors = require('cors')
const BodyParser = require('body-parser')

const App = Express()
App.use(Logger('dev'))
App.use(Cors({ origin: '*' }))
App.use(BodyParser.json({ limit: '50mb', extended: true }))
App.use(BodyParser.urlencoded({ limit: '50mb', extended: false }))
App.use('/api', require('./routes/index'))

module.exports = App
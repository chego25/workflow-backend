// Libraries
const Express = require('express')
const Lodash = require('lodash')
const Router = Express.Router()

// Services
const Access = require('../../../services/access')

Router.head('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            await Access.logout(res.locals.header)
            res.locals.status = {
                code: 204
            }
        }
    }
    catch (error) {
        res.locals.status = {
            content: {
                message: Lodash.isUndefined(error.statusCode)
                    ? 'The server has encountered an unexpected internal error.'
                    : error.message
            },
            code: Lodash.isUndefined(error.statusCode)
                ? 500
                : error.statusCode,
            error: error
        }
    }
    finally { next() }
})

module.exports = Router
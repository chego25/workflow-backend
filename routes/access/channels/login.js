// Libraries
const Express = require('express')
const Lodash = require('lodash')
const Router = Express.Router()

// Services
const Access = require('../../../services/access')

Router.post('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            res.locals.status = {
                content: {
                    token: await Access.login(res.locals.body)
                },
                code: 200
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
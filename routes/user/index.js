// Libraries
const Express = require('express')
const Lodash = require('lodash')
const Router = Express.Router()

// Services
const User = require('../../services/user')

Router.post('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            await User.create(res.locals.profile, res.locals.body)
            res.locals.status = {
                content: {
                    message: 'User has been created successfully.'
                },
                code: 201
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

Router.get('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            res.locals.status = {
                content: await User.read(res.locals.profile, res.locals.query),
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

Router.patch('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            await User.update(res.locals.profile, res.locals.query, res.locals.body)
            res.locals.status = {
                content: {
                    message: 'User has been updated successfully.'
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

Router.delete('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            await User.delete(res.locals.profile, res.locals.query)
            res.locals.status = {
                content: {
                    message: 'User has been deleted successfully.'
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
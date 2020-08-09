// Libraries
const Express = require('express')
const Lodash = require('lodash')
const Router = Express.Router()

// Services
const Workflow = require('../../services/workflow')

Router.post('/', async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            await Workflow.create(res.locals.profile, res.locals.body)
            res.locals.status = {
                content: {
                    message: 'Workflow has been created successfully.'
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
                content: await Workflow.read(res.locals.profile),
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
            res.locals.status = {
                content: await Workflow.update(res.locals.profile, res.locals.query, res.locals.body),
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
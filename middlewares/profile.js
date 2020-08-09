// Libraries
const Lodash = require('lodash')

// Services
const Access = require('../services/access')

module.exports = async (req, res, next) => {
    try {
        if (Lodash.isUndefined(res.locals.status)) {
            res.locals.profile = await Access.profile(res.locals.header)
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
    finally {
        next()
    }
}
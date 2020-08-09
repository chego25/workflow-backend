// Libraries
const Lodash = require('lodash')
const HttpError = require('http-errors')

module.exports = (req, res, next) => {
    if (Lodash.isUndefined(res.locals.status)) {
        let message = 'The requested URI has not been exposed by the server.'
        let code = 404
        res.locals.status = {
            content: { message: message },
            code: code,
            error: HttpError(code, message)
        }
    }
    next()
}
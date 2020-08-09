// Libraries
const Lodash = require('lodash')

module.exports = (req, res, next) => {
    res.locals.header = {}
    if (!Lodash.isUndefined(req.headers.authorization)) {
        let authHeader = req.headers.authorization.split(' ')
        if (Lodash.isEqual(authHeader[0], 'Bearer')) {
            res.locals.header.token = authHeader[1]
        }
    }
    res.locals.body = req.body
    res.locals.query = req.query
    next()
}
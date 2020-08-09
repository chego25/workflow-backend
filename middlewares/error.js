// Libraries
const Lodash = require('lodash')

module.exports = (req, res, next) => {
    console.log(res.locals.status.error)
    if (Lodash.isEqual(req.method, 'HEAD')) {
        res.sendStatus(res.locals.status.code)
    }
    else {
        res.type('json').status(res.locals.status.code).send(res.locals.status.content)
    }
}
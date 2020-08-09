module.exports = (req, res, next) => {
    console.log(JSON.stringify(res.locals))
    next()
}
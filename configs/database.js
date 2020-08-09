const Database = require('mongoose')

Database.connect(process.env.DB_URL + 'workflow' + process.env.DB_PARAM, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
Database.connection.on('error', console.error.bind(console))

module.exports = Database
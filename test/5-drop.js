// Libraries
const Database = require('mongoose')

after((done) => {
    let connection = Database.createConnection(process.env.DB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    connection.dropDatabase().then(() => {
        done()
    })
})
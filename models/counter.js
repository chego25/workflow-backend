const database = require('../configs/database')

const counterSchema = database.Schema({

    user:                               { type: Number,     min: 1,                                     required: true },
    role:                               { type: Number,     min: 1,                                     required: true },
    workflow:                           { type: Number,     min: 1,                                     required: true }
})

module.exports = database.model('Counter', counterSchema)
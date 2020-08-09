const database = require('../configs/database')

const roleSchema = database.Schema({

    id:                                 { type: Number,     min: 0,                                     required: true },
    name:                               { type: String,                         maxlength: 100,         required: true }

})

roleSchema.index({ id: 1 }, { unique: true })

module.exports = database.model('Role', roleSchema)
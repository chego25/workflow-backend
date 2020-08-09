const database = require('../configs/database')

const levelSchema = database.Schema({

    id:                                 { type: Number,     min: 1,                                     required: true },
    workflow:                           { type: Number,     min: 1,                                     required: true },
    type:                               { type: String,     minlength: 6,       maxlength: 11,          required: true }
    
})

levelSchema.index({ id: 1, workflow: 1 }, { unique: true })

module.exports = database.model('Level', levelSchema)
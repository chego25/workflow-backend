const database = require('../configs/database')

const credentialSchema = database.Schema({

    id:                                 { type: Number,     min: 1,                                     required: true },
    user:                               { type: String,     minlength: 4,       maxlength: 20,          required: true },
    passwords:                         [{ type: String,     minlength: 60,      maxlength: 60,          required: true }],
    sessions:                          [{ type: String,     minlength: 60,      maxlength: 60,          required: true }]

})

credentialSchema.index({ id: 1 }, { unique: true })
credentialSchema.index({ user: 1 }, { unique: true })

module.exports = database.model('Credential', credentialSchema)
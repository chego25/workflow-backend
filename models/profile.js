const database = require('../configs/database')

const profileSchema = database.Schema({

    id:                                 { type: Number,     min: 0,                                     required: true },
    name:                               { type: String,                         maxlength: 100,         required: true },
    role:                               { type: Number,     min: 0,                                     required: true },
    login:                              { type: Date                                                                   },
    logout:                             { type: Date                                                                   },
    update:                             { type: Date                                                                   }

})

profileSchema.index({ id: 1 }, { unique: true })

module.exports = database.model('Profile', profileSchema)
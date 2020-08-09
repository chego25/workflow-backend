const database = require('../configs/database')

const approvalSchema = database.Schema({

    id:                                 { type: Number,     min: 1,                                     required: true },
    level:                              { type: Number,     min: 1,                                     required: true },
    workflow:                           { type: Number,     min: 1,                                     required: true },
    stamp:                              { type: Date,                                                   required: true },
    editor:                             { type: Number,     min: 1,                                     required: true },
    content: {
        order:                          { type: Number,     min: 1,                                     required: true },
        user:                           { type: Number,     min: 1,                                     required: true },
        action:                         { type: String,     minlength: 8,       maxlength: 18                          }
    }
    
})

approvalSchema.index({ id: 1, level: 1, workflow: 1, stamp: 1 }, { unique: true })

module.exports = database.model('Approval', approvalSchema)
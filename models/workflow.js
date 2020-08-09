const database = require('../configs/database')

const workflowSchema = database.Schema({

    id:                                 { type: Number,     min: 1,                                     required: true },
    name:                               { type: String,     minlength: 1,       maxlength: 100,         required: true },
    details:                            { type: String,                         maxlength: 1000                        },
    status:                             { type: String,     minlength: 6,       maxlength: 10,          required: true }
    
})

workflowSchema.index({ id: 1 }, { unique: true })

module.exports = database.model('Workflow', workflowSchema)
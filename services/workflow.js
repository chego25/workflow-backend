// Libraries
const Joi = require('@hapi/joi')
const Lodash = require('lodash')
const HttpError = require('http-errors')

// Configs
const Database = require('../configs/database')

// Models
const Counter = require('../models/counter')
const Workflow = require('../models/workflow')
const Level = require('../models/level')
const Approval = require('../models/approval')

// Validators
const CreateSchema = Joi.object({
    name: Joi.string().max(100).required(),
    details: Joi.string().max(1000).optional(),
    levels: Joi.array().items(Joi.object({
        type: Joi.string().valid('Sequential', 'Round Robin', 'Anyone').required(),
        approvals: Joi.array().items(Joi.object({
            user: Joi.number().min(1).required()
        })).min(1).required()
    })).min(1).required()
})
const UpdateSchema = Joi.object({
    id: Joi.string().pattern(new RegExp('^[0-9]*$')).required(),
    level: Joi.string().pattern(new RegExp('^[0-9]*$')).required(),
    workflow: Joi.string().pattern(new RegExp('^[0-9]*$')).required()
})
const ActionSchema = Joi.object({
    action: Joi.string().valid('Approved', 'Rejected', 'Rejected & Removed').required()
})

const fetchWorkflow = (workflow) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            let workflows = await Workflow.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [ '$id', parseInt(workflow) ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'levels',
                        let: {
                            workflow: '$id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ '$workflow', '$$workflow' ]
                                    }
                                }
                            },
                            {
                                $sort: {
                                    id: 1
                                }
                            },
                            {
                                $lookup: {
                                    from: 'approvals',
                                    let: {
                                        level: '$id',
                                        workflow: '$workflow'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: [ '$level', '$$level' ] },
                                                        { $eq: [ '$workflow', '$$workflow' ] }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $sort: {
                                                id: 1
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: 'profiles',
                                                localField: 'user',
                                                foreignField: 'id',
                                                as: 'user'
                                            }
                                        },
                                        {
                                            $addFields: {
                                                user: {
                                                    $arrayElemAt: [ '$user', 0 ]
                                                }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                __v: 0,
                                                level: 0,
                                                workflow: 0,
                                                'user._id': 0,
                                                'user.__v': 0,
                                                'user.role': 0,
                                                'user.login': 0,
                                                'user.logout': 0,
                                                'user.update': 0
                                            }
                                        }
                                    ],
                                    as: 'approvals'
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    __v: 0,
                                    workflow: 0,
                                    approval: 0
                                }
                            }
                        ],
                        as: 'levels'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        __v: 0,
                        level: 0
                    }
                }
            ]).session(session)
            await session.commitTransaction()
            session.endSession()
            resolve(workflows[0])
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}

module.exports.create = (profile, body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            CreateSchema.validateAsync(body)
            if (profile.role.id > 1) { throw new HttpError(403, 'Only an Administrator or a Manager can create a new Workflow.') }
            else {
                let counter = await Counter.findOne({}, { _id: 0, __v: 0 }, { session: session })
                let workflows = [{
                    id: counter.workflow,
                    name: body.name,
                    status: 'Active'
                }]
                if (!Lodash.isUndefined(body.details)) { workflows[0].details = body.details }
                let levels = [], approvals = []
                for (let i = 0; i < body.levels.length; i++) {
                    levels.push({
                        id: i + 1,
                        workflow: counter.workflow,
                        type: body.levels[i].type
                    })
                    for (let j = 0; j < body.levels[i].approvals.length; j++) {
                        approvals.push({
                            id: j + 1,
                            level: i + 1,
                            workflow: counter.workflow,
                            user: body.levels[i].approvals[j].user
                        })
                    }
                }
                await Workflow.insertMany(workflows, { session: session })
                await Level.insertMany(levels, { session: session })
                await Approval.insertMany(approvals, { session: session })
                await Counter.updateOne({}, { $inc: { workflow: 1 } }, { session: session })
                await session.commitTransaction()
                session.endSession()
                resolve()
            }
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}

module.exports.read = (profile) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            let root = Workflow
            let pipeline = [
                {
                    $sort: {
                        id: 1
                    }
                },
                {
                    $lookup: {
                        from: 'levels',
                        let: {
                            workflow: '$id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ '$workflow', '$$workflow' ]
                                    }
                                }
                            },
                            {
                                $sort: {
                                    id: 1
                                }
                            },
                            {
                                $lookup: {
                                    from: 'approvals',
                                    let: {
                                        level: '$id',
                                        workflow: '$workflow'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: [ '$level', '$$level' ] },
                                                        { $eq: [ '$workflow', '$$workflow' ] }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $sort: {
                                                id: 1
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: 'profiles',
                                                localField: 'user',
                                                foreignField: 'id',
                                                as: 'user'
                                            }
                                        },
                                        {
                                            $addFields: {
                                                user: {
                                                    $arrayElemAt: [ '$user', 0 ]
                                                }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                __v: 0,
                                                level: 0,
                                                workflow: 0,
                                                'user._id': 0,
                                                'user.__v': 0,
                                                'user.role': 0,
                                                'user.login': 0,
                                                'user.logout': 0,
                                                'user.update': 0
                                            }
                                        }
                                    ],
                                    as: 'approvals'
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    __v: 0,
                                    workflow: 0,
                                    approval: 0
                                }
                            }
                        ],
                        as: 'levels'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        __v: 0,
                        level: 0
                    }
                }
            ]
            if (!Lodash.isEqual(profile.role.id, 0)) {
                root = Approval
                pipeline = Lodash.concat([
                    {
                        $match: {
                            $expr: {
                                $eq: [ '$user', profile.id ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'workflows',
                            localField: 'workflow',
                            foreignField: 'id',
                            as: 'workflow'
                        }
                    },
                    {
                        $addFields: {
                            workflow: {
                                $arrayElemAt: [ '$workflow', 0 ]
                            }
                        }
                    },
                    {
                        $addFields: {
                            id: '$workflow.id',
                            name: '$workflow.name',
                            details: '$workflow.details',
                            status: '$workflow.status'
                        }
                    },
                    {
                        $group: {
                            _id: '$id',
                            id: {
                                $first: '$id'
                            },
                            name: {
                                $first: '$name'
                            },
                            details: {
                                $first: '$details'
                            },
                            status: {
                                $first: '$status'
                            }
                        }
                    }
                ], pipeline)
            }
            let workflows = await root.aggregate(pipeline).session(session)
            await session.commitTransaction()
            session.endSession()
            resolve(workflows)
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(Lodash.isEqual(error.name, 'ValidationError')
                ? new HttpError(400, 'Server was unable to parse the request parameters.')
                : error)
        }
    })
}

module.exports.update = (profile, query, body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            UpdateSchema.validateAsync(query)
            ActionSchema.validateAsync(body)
            let workflow = await fetchWorkflow(query.workflow)
            if (Lodash.isNull(workflow)) {
                throw new HttpError(404, 'The Workflow information doesn\'t exist.')
            }
            else if (Lodash.isEqual(workflow.status, 'Active')) {
                let approval = await Approval.findOne({
                    id: parseInt(query.id),
                    level: parseInt(query.level),
                    workflow: parseInt(query.workflow)
                }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(approval)) {
                    throw new HttpError(404, 'The Approval information doesn\'t exist.')
                }
                else if (!Lodash.isEqual(approval.user, profile.id)) {
                    throw new HttpError(403, 'You haven\'t been assigned for this Approval.')
                }
                else if (Lodash.isUndefined(approval.action)) {
                    let id = parseInt(query.level) - 1
                    if (!Lodash.isEqual(id, 0)) {
                        let level = Lodash.find(workflow.levels, { id: id })
                        let responses = Lodash.compact(Lodash.map(level.approvals, (approval) => {
                            return approval.action
                        }))
                        if ((Lodash.isEqual(level.type, 'Anyone') && Lodash.isEqual(responses.length, 0)) || !Lodash.isEqual(level.approvals.length, responses.length)) {
                            throw new HttpError(406, 'Approvals are yet to be received from the earlier Level.')
                        }
                    }
                    let level = Lodash.find(workflow.levels, { id: ++id })
                    let responses = Lodash.compact(Lodash.map(level.approvals, (approval) => {
                        return approval.action
                    }))
                    switch (level.type) {
                        case 'Sequential': {
                            id = parseInt(query.id) - 1
                            if (!Lodash.isEqual(id, 0)) {
                                let approval = Lodash.find(level.approvals, { id: id })
                                if (Lodash.isUndefined(approval.action)) {
                                    throw new HttpError(406, 'The preceeding Approval has not yet been received.')
                                }
                            }
                            await Approval.updateOne({
                                id: parseInt(query.id),
                                level: parseInt(query.level),
                                workflow: parseInt(query.workflow)
                            }, { $set: body }, { session: session })
                            if (Lodash.isEqual(body.action, 'Rejected')) {
                                await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Terminated' } }, { session: session })
                            }
                            else if (Lodash.isEqual(responses.length + 1, level.approvals.length) && Lodash.isEqual(level.id, workflow.levels.length)) {
                                await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Executed' } }, { session: session })
                            }
                            break
                        }
                        case 'Round Robin': {
                            await Approval.updateOne({
                                id: parseInt(query.id),
                                level: parseInt(query.level),
                                workflow: parseInt(query.workflow)
                            }, { $set: body }, { session: session })
                            if (Lodash.isEqual(body.action, 'Rejected')) {
                                await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Terminated' } }, { session: session })
                            }
                            else if (Lodash.isEqual(responses.length + 1, level.approvals.length) && Lodash.isEqual(level.id, workflow.levels.length)) {
                                await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Executed' } }, { session: session })
                            }
                            break
                        }
                        case 'Anyone': {
                            if (Lodash.isEqual(responses.length, 1)) {
                                throw new HttpError(406, 'Necessary Approval has already been received for this level.')
                            }
                            else {
                                await Approval.updateOne({
                                    id: parseInt(query.id),
                                    level: parseInt(query.level),
                                    workflow: parseInt(query.workflow)
                                }, { $set: body }, { session: session })
                                if (Lodash.isEqual(body.action, 'Rejected')) {
                                    await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Terminated' } }, { session: session })
                                }
                                else if (Lodash.isEqual(level.id, workflow.levels.length)) {
                                    await Workflow.updateOne({ id: workflow.id }, { $set: { status: 'Executed' } }, { session: session })
                                }
                            }
                            break
                        }
                        default: { break }
                    }
                }
                else {
                    throw new HttpError(409, 'The Approval response has already been received.')
                }
            }
            else {
                throw new HttpError(409, 'Workflow is currently in \'' + workflow.status + '\' state.')
            }
            await session.commitTransaction()
            session.endSession()
            resolve(await fetchWorkflow(query.workflow))
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(Lodash.isEqual(error.name, 'ValidationError')
                ? new HttpError(400, 'Server was unable to parse the request parameters.')
                : error)
        }
    })
}
// Libraries
const Joi = require('@hapi/joi')
const Bcrypt = require('bcryptjs')
const Lodash = require('lodash')
const HttpError = require('http-errors')

// Configs
const Database = require('../configs/database')

// Models
const Counter = require('../models/counter')
const Credential = require('../models/credential')
const Profile = require('../models/profile')
const Role = require('../models/role')

// Validators
const CreateSchema = Joi.object({
    user: Joi.string().pattern(new RegExp('^[A-Za-z0-9]{4,20}$')).required(),
    name: Joi.string().pattern(new RegExp('^[A-Za-z\\s]{1,100}$')).required(),
    role: Joi.number().min(1).required()
})
const ReadSchema = Joi.object({
    user: Joi.string().pattern(new RegExp('^[A-Za-z0-9]{4,20}$')).optional(),
    role: Joi.number().min(1).optional()
})
const QuerySchema = Joi.object({
    id: Joi.string().pattern(new RegExp('^[0-9]*$')).required()
})
const BodySchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[A-Za-z\s]{1,100}$')).optional(),
    role: Joi.number().min(1).optional()
})

module.exports.create = (profile, body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            CreateSchema.validateAsync(body)
            if (Lodash.isEqual(profile.role.id, 0)) {
                let role = await Role.findOne({ id: body.role }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(role)) { throw new HttpError(409, 'Role with ID: ' + body.role + ' doesn\'t exist.') }
                else {
                    let counter = await Counter.findOne({}, { _id: 0, __v: 0 }, { session: session })
                    await Profile.insertMany([{ id: counter.user, name: body.name, role: body.role }], { session: session })
                    await Credential.insertMany([{ id: counter.user, user: body.user, passwords: [ Bcrypt.hashSync('12345678', 10) ], sessions: [] }], { session: session })
                    await Counter.updateOne({}, { $inc: { user: 1 } }, { session: session })
                    await session.commitTransaction()
                    session.endSession()
                    resolve()
                }
            }
            else { throw new HttpError(403, 'Only an Administrator can create a new User.') }
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

module.exports.read = (profile, query) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            ReadSchema.validateAsync(query)
            if (Lodash.isEqual(profile.role.id, 0)) {
                let matcher = { $match: { $expr: { $and: [] } } }
                if (!Lodash.isUndefined(query.user)) { matcher.$match.$expr.$and.push({ $eq: [ '$user', query.user ] }) }
                if (!Lodash.isUndefined(query.role)) { matcher.$match.$expr.$and.push({ $eq: [ '$role', parseInt(query.role) ] }) }
                let pipeline = [
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'role',
                            foreignField: 'id',
                            as: 'role'
                        }
                    },
                    {
                        $addFields: {
                            role: {
                                $arrayElemAt: [ '$role', 0 ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            'role._id': 0,
                            'role.__v': 0
                        }
                    }
                ]
                if (!Lodash.isEqual(matcher.$match.$expr.$and.length, 0)) { pipeline.unshift(matcher) }
                let users = await Profile.aggregate(pipeline).session(session)
                await session.commitTransaction()
                session.endSession()
                resolve(users)
            }
            else { throw new HttpError(403, 'Only an Administrator can request for the Users.') }
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
            QuerySchema.validateAsync(query)
            BodySchema.validateAsync(body)
            if (Lodash.isEqual(profile.role.id, 0)) {
                let user = await Profile.findOne({ id: parseInt(query.id) }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(user)) { throw new HttpError(404, 'User with ID: ' + query.id + ' doesn\'t exist.') }
                else if (Lodash.isEqual(user.role, 0)) { throw new HttpError(403, 'User: ' + user.name + ' cannot be updated.') }
                else if (!Lodash.isUndefined(body.role)) {
                    let role = await Role.findOne({ id: body.role }, { _id: 0, __v: 0 }, { session: session })
                    if (Lodash.isNull(role)) { throw new HttpError(409, 'Role with ID: ' + body.role + ' doesn\'t exist.') }
                }
                await Profile.updateOne({ id: parseInt(query.id) }, { $set: body }, { session: session })
                await session.commitTransaction()
                session.endSession()
                resolve()
            }
            else { throw new HttpError(403, 'Only an Administrator can update an User.') }
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

module.exports.delete = (profile, query) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            QuerySchema.validateAsync(query)
            if (Lodash.isEqual(profile.role.id, 0)) {
                let user = await Profile.findOne({ id: parseInt(query.id) }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(user)) { throw new HttpError(404, 'User with ID: ' + query.id + ' doesn\'t exist.') }
                else if (Lodash.isEqual(user.role, 0)) { throw new HttpError(403, 'User: ' + user.name + ' cannot be deleted.') }
                else {
                    await Profile.deleteOne({ id: parseInt(query.id) }, { session: session })
                    await Credential.deleteOne({ id: parseInt(query.id) }, { session: session })
                    await session.commitTransaction()
                    session.endSession()
                    resolve()
                }
            }
            else { throw new HttpError(403, 'Only an Administrator can delete an User.') }
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
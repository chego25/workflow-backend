// Libraries
const Joi = require('@hapi/joi')
const Lodash = require('lodash')
const HttpError = require('http-errors')

// Configs
const Database = require('../configs/database')

// Models
const Counter = require('../models/counter')
const Role = require('../models/role')

// Validators
const QuerySchema = Joi.object({
    id: Joi.string().pattern(new RegExp('^[0-9]*$')).required()
})
const BodySchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[A-Za-z0-9\\s]*$')).required()
})

module.exports.create = (profile, body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            BodySchema.validateAsync(body)
            if (Lodash.isEqual(profile.role.id, 0)) {
                let role = await Role.findOne({ name: body.name }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(role)) {
                    let counter = await Counter.findOne({}, { _id: 0, __v: 0 }, { session: session })
                    await Role.insertMany([{ id: counter.role, name: body.name }], { session: session })
                    await Counter.updateOne({}, { $inc: { role: 1 } }, { session: session })
                    await session.commitTransaction()
                    session.endSession()
                    resolve()
                }
                else { throw new HttpError(409, 'Role: ' + role.name + ' already exists.') }
            }
            else { throw new HttpError(403, 'Only an Administrator can create a new Role.') }
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

module.exports.read = (profile) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            if (Lodash.isEqual(profile.role.id, 0)) {
                let roles = await Role.aggregate([
                    {
                        $addFields: {
                            text: '$name',
                            value: '$id'
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            id: 0,
                            name: 0
                        }
                    }
                ]).session(session)
                await session.commitTransaction()
                session.endSession()
                resolve(roles)
            }
            else { throw new HttpError(403, 'Only an Administrator can request for the Roles.') }
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
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
                let role = await Role.findOne({ id: parseInt(query.id) }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(role)) { throw new HttpError(404, 'Role with ID: ' + query.id + ' doesn\'t exist.') }
                else if (Lodash.isEqual(role.id, 0)) { throw new HttpError(403, 'Role: ' + role.name + ' cannot be updated.') }
                else {
                    role = await Role.findOne({ name: body.name }, { _id: 0, __v: 0 }, { session: session })
                    if (Lodash.isNull(role)) {
                        await Role.updateOne({ id: parseInt(query.id) }, { $set: { name: body.name } }, { session: session })
                        await session.commitTransaction()
                        session.endSession()
                        resolve()
                    }
                    else { throw new HttpError(409, 'Role with Name: ' + body.name + ' already exists.') }
                }
            }
            else { throw new HttpError(403, 'Only an Administrator can update a Role.') }
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
                let role = await Role.findOne({ id: parseInt(query.id) }, { _id: 0, __v: 0 }, { session: session })
                if (Lodash.isNull(role)) { throw new HttpError(404, 'Role with ID: ' + query.id + ' doesn\'t exist.') }
                else if (Lodash.isEqual(role.id, 0)) { throw new HttpError(403, 'Role: ' + role.name + ' cannot be deleted.') }
                else {
                    await Role.deleteOne({ id: parseInt(query.id) }, { session: session })
                    await session.commitTransaction()
                    session.endSession()
                    resolve()
                }
            }
            else { throw new HttpError(403, 'Only an Administrator can delete a Role.') }
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
// Libraries
const Joi = require('@hapi/joi')
const Bcrypt = require('bcryptjs')
const JSONWebToken = require('jsonwebtoken')
const Lodash = require('lodash')
const Moment = require('moment')
const HttpError = require('http-errors')
const Randomise = require('randomatic')

// Configs
const Database = require('../configs/database')

// Models
const Credential = require('../models/credential')
const Profile = require('../models/profile')

// Validators
const LoginSchema = Joi.object({
    user: Joi.string().pattern(new RegExp('^[A-Za-z0-9]{4,20}$')).required(),
    password: Joi.string().required()
})
const PasswordSchema = Joi.object({
    old: Joi.string().required(),
    new: Joi.string().required()
})

const processToken = (token) => {
    return new Promise((resolve, reject) => {
        JSONWebToken.sign(token, process.env.BCRYPT, { expiresIn: '15m' }, (error, token) => {
            error ? reject(error) : resolve(token)
        })
    })
}

const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        JSONWebToken.verify(token, process.env.BCRYPT, (error, token) => {
            error ? reject(error) : resolve(token)
        })
    })
}

module.exports.login = (body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            LoginSchema.validateAsync(body)
            let message = 'Provided Username, Password or both are incorrect.'
            let credential = await Credential.findOne({ user: body.user }, { _id: 0, __v: 0 }, { session: session })
            if (Lodash.isNull(credential)) { throw new HttpError(401, message) }
            else if (Bcrypt.compareSync(body.password, credential.passwords[0])) {
                let key = Randomise('Aa0!', 60)
                await Credential.updateOne({ id: credential.id }, { $push: { sessions: key } }, { session: session })
                await Profile.updateOne({ id: credential.id }, { $set: { login: Moment.utc().toISOString() } }, { session: session })
                let token = await processToken({ uid: credential.id, key: key })
                await session.commitTransaction()
                session.endSession()
                resolve(token)
            }
            else { throw new HttpError(401, message) }
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}

module.exports.validate = (header) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            if (Lodash.isUndefined(header.token)) { throw new HttpError(403, 'Authorisation Token is not present in the header.') }
            else {
                let message = 'Provided Authorisation Token is not a valid one.'
                let token = await validateToken(header.token)
                let credential = await Credential.findOne({ id: token.uid }, {}, { session: session })
                if (Lodash.isNull(credential)) { throw new HttpError(403, message) }
                else if (Lodash.includes(credential.sessions, token.key)) {
                    await session.commitTransaction()
                    session.endSession()
                    resolve(token)
                }
                else throw new HttpError(403, message)
            }
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            Lodash.isEqual(error.name, 'TokenExpiredError') || Lodash.isEqual(error.name, 'JsonWebTokenError')
                ? reject(HttpError(403, 'Provided Authorisation Token is not a valid one.'))
                : reject(error)
        }
    })
}

module.exports.profile = (header) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            let profiles = await Profile.aggregate([
                {
                    $match: {
                        id: header.token.uid
                    }
                },
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
            ]).session(session)
            await session.commitTransaction()
            session.endSession()
            resolve(Lodash.isEqual(profiles.length, 0) ? null : profiles[0])
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}

module.exports.password = (header, body) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            PasswordSchema.validateAsync(body)
            let credential = await Credential.findOne({ id: header.token.uid }, {}, { session: session, lean: true })
            if (Bcrypt.compareSync(body.old, credential.passwords[0])) {
                credential.passwords.unshift(await Bcrypt.hashSync(body.new, 10))
                await Credential.updateOne({ id: credential.id }, { $set: { passwords: credential.passwords } }, { session: session })
                await Profile.updateOne({ id: credential.id }, { $set: { update: Moment.utc().toISOString() } }, { session: session })
                await session.commitTransaction()
                session.endSession()
                resolve()
            }
            else { throw new HttpError(403, 'Provided Old Password is not matching with our record.') }
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}

module.exports.logout = (header) => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            let credential = await Credential.findOne({ id: header.token.uid }, {}, { session: session, lean: true })
            credential.sessions.splice(Lodash.indexOf(credential.sessions, header.token.key), 1)
            await Credential.updateOne({ id: credential.id }, { $set: { sessions: credential.sessions } }, { session: session })
            await Profile.updateOne({ id: credential.id }, { $set: { logout: Moment.utc().toISOString() } }, { session: session })
            await session.commitTransaction()
            session.endSession()
            resolve()
        }
        catch (error) {
            await session.abortTransaction()
            session.endSession()
            reject(error)
        }
    })
}
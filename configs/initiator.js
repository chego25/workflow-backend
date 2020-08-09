// Libraries
const Bcrypt = require('bcryptjs')
const Lodash = require('lodash')

// Configs
const Database = require('../configs/database')

// Models
const Counter = require('../models/counter')
const Role = require('../models/role')
const Credential = require('../models/credential')
const Profile = require('../models/profile')

const createModel = (model) => {
    return new Promise((resolve, reject) => {
        model.createCollection((error) => error ? reject(error) : resolve())
    })
}

const loadDefaults = () => {
    return new Promise(async (resolve, reject) => {
        const session = await Database.startSession()
        session.startTransaction()
        try {
            await createModel(Counter)
            await Counter.insertMany([{
                user: 1,
                role: 1,
                workflow: 1
            }], { session: session })
            await Role.insertMany([{
                id: 0,
                name: 'Admin'
            }], { session: session })
            await Credential.insertMany([{
                id: 0,
                user: process.env.USER,
                passwords: [ Bcrypt.hashSync(process.env.PASSWORD, 10) ],
                sessions: []
            }], { session: session })
            await Profile.insertMany([
                {
                    id: 0,
                    name: 'Administrator',
                    role: 0
                }
            ], { session: session })
            await session.commitTransaction()
            session.endSession()
            resolve()
        }
        catch (error) {
            if (Lodash.isEqual(error.name, 'MongoError') || Lodash.isEqual(error.name, 'BulkWriteError')) { resolve() }
            else {
                await session.abortTransaction()
                session.endSession()
                reject(error)
            }
        }
    })
}

module.exports.loadDefaults = loadDefaults
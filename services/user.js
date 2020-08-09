// Libraries
const Joi = require('@hapi/joi')
const Bcrypt = require('bcryptjs')

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

module.exports.create = (profile, body) => {
    return new Promise(async (resolve, reject) => {

    })
}

module.exports.read = (profile, query) => {
    return new Promise(async (resolve, reject) => {

    })
}

module.exports.update = (profile, query, body) => {
    return new Promise(async (resolve, reject) => {

    })
}

module.exports.delete = (profile, query) => {
    return new Promise(async (resolve, reject) => {

    })
}
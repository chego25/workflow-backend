// Libraries
const Chai = require('chai')
const ChaiHttp = require('chai-http')
const Lodash = require('lodash')
const Server = require('../app')
const Should = Chai.should()
Chai.use(ChaiHttp)

var Token = null

describe('Role Management', () => {
    before((done) => {
        Chai.request(Server).post('/api/access/login').send({
            user: process.env.USER,
            password: process.env.PASSWORD
        }).end((error, response) => {
            if (error) {
                console.log(error)
                this.skip()
            }
            else if (Lodash.isEqual(response.status, 200)) {
                Token = { authorization: 'Bearer ' + response.body.token }
            }
            else {
                console.log(response.status + ' - ' + response.body.message)
                this.skip()
            }
            done()
        })
    })
    describe('Create Role API - POST /api/role ', () => {
        it('should create a new Role named \'Manager\'', (done) => {
            Chai.request(Server).post('/api/role').set(Token).send({
                name: 'Manager'
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Role has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Role named \'Approver\'', (done) => {
            Chai.request(Server).post('/api/role').set(Token).send({
                name: 'Approver'
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Role has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Role named \'Other\'', (done) => {
            Chai.request(Server).post('/api/role').set(Token).send({
                name: 'Other'
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Role has been created successfully.')
                }
                done()
            })
        })
    })
    describe('Read Roles API - GET /api/role ', () => {
        it('should return all the Roles in the system', (done) => {
            Chai.request(Server).get('/api/role').set(Token).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('array')
                    response.body.should.have.lengthOf(4)
                    for (let i = 0; i < 4; i++) {
                        response.body[i].should.be.an('object')
                        response.body[i].should.have.all.keys('text', 'value')
                        response.body[i].text.should.be.a('string')
                        response.body[i].value.should.be.a('number')
                        response.body[i].value.should.be.equal(i)
                        switch (i) {
                            case 0: {
                                response.body[i].text.should.be.equal('Admin')
                                break
                            }
                            case 1: {
                                response.body[i].text.should.be.equal('Manager')
                                break
                            }
                            case 2: {
                                response.body[i].text.should.be.equal('Approver')
                                break
                            }
                            default: { break }
                        }
                    }
                }
                done()
            })
        })
    })
    describe('Update Role API - PUT /api/role ', () => {
        it('should update name of the role \'Other\' to \'Another\'', (done) => {
            Chai.request(Server).put('/api/role?id=3').set(Token).send({
                name: 'Another'
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Role has been updated successfully.')
                }
                done()
            })
        })
    })
    describe('Delete Role API - DELETE /api/role ', () => {
        it('should delete the role with name \'Another\'', (done) => {
            Chai.request(Server).delete('/api/role?id=3').set(Token).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Role has been deleted successfully.')
                }
                done()
            })
        })
    })
    after((done) => {
        Chai.request(Server).head('/api/access/logout').set(Token).end((error) => {
            if (error) { console.log(error) }
            Token = null
            done()
        })
    })
})
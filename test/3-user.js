// Libraries
const Chai = require('chai')
const ChaiHttp = require('chai-http')
const Lodash = require('lodash')
const Server = require('../app')
const Should = Chai.should()
Chai.use(ChaiHttp)

var Token = null

describe('User Management', () => {
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
    describe('Create User API - POST /api/user ', () => {
        it('should create a new User named \'Ashutosh Kinikar\' with Role \'Manager\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'akinikar',
                name: 'Ashutosh Kinikar',
                role: 1
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'Elsa Ingram\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'eingram',
                name: 'Elsa Ingram',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'Paul Marsh\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'pmarsh',
                name: 'Paul Marsh',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'D Joshi\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'djoshi',
                name: 'D Joshi',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'Nick Holden\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'nholden',
                name: 'Nick Holden',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'John Doe\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'jdoe',
                name: 'John Doe',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
        it('should create a new User named \'Arka\' with Role \'Approver\'', (done) => {
            Chai.request(Server).post('/api/user').set(Token).send({
                user: 'ahalder',
                name: 'Arka',
                role: 2
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been created successfully.')
                }
                done()
            })
        })
    })
    describe('Read Users API - GET /api/user ', () => {
        it('should return all the Users in the system', (done) => {
            Chai.request(Server).get('/api/user').set(Token).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('array')
                    response.body.should.have.lengthOf(8)
                    for (let i = 0; i < 8; i++) {
                        response.body[i].should.be.an('object')
                        response.body[i].should.have.all.keys('id', 'name', 'role')
                        response.body[i].id.should.be.a('number')
                        response.body[i].id.should.be.equal(i)
                        response.body[i].name.should.be.a('string')
                        response.body[i].role.should.be.a('object')
                        response.body[i].role.should.have.all.keys('id', 'name')
                        switch (i) {
                            case 0: {
                                response.body[i].name.should.be.equal('Administrator')
                                response.body[i].role.id.should.be.equal(0)
                                response.body[i].role.name.should.be.equal('Admin')
                                break
                            }
                            case 1: {
                                response.body[i].name.should.be.equal('Ashutosh Kinikar')
                                response.body[i].role.id.should.be.equal(1)
                                response.body[i].role.name.should.be.equal('Manager')
                                break
                            }
                            case 2: {
                                response.body[i].name.should.be.equal('Elsa Ingram')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
                                break
                            }
                            case 3: {
                                response.body[i].name.should.be.equal('Paul Marsh')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
                                break
                            }
                            case 4: {
                                response.body[i].name.should.be.equal('D Joshi')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
                                break
                            }
                            case 5: {
                                response.body[i].name.should.be.equal('Nick Holden')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
                                break
                            }
                            case 6: {
                                response.body[i].name.should.be.equal('John Doe')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
                                break
                            }
                            case 7: {
                                response.body[i].name.should.be.equal('Arka')
                                response.body[i].role.id.should.be.equal(2)
                                response.body[i].role.name.should.be.equal('Approver')
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
    describe('Update User API - PATCH /api/user ', () => {
        it('should update name of the user \'Arka\' to \'Arka Halder\'', (done) => {
            Chai.request(Server).patch('/api/user?id=7').set(Token).send({
                name: 'Arka Halder'
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been updated successfully.')
                }
                done()
            })
        })
    })
    describe('Delete User API - DELETE /api/user ', () => {
        it('should delete the user with name \'Arka Halder\'', (done) => {
            Chai.request(Server).delete('/api/user?id=7').set(Token).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('User has been deleted successfully.')
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
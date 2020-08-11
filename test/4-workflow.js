// Libraries
const Chai = require('chai')
const ChaiHttp = require('chai-http')
const Lodash = require('lodash')
const Server = require('../app')
const Should = Chai.should()
Chai.use(ChaiHttp)

var Token = null

describe('Workflow Management', () => {
    describe('Create Workflow API - POST /api/workflow ', () => {
        before((done) => {
            Chai.request(Server).post('/api/access/login').send({
                user: 'akinikar',
                password: '12345678'
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
        it('should create a new Workflow with three Levels of type Sequential (Elsa Ingram, Nick Holden), '
            + 'Round Robin (Paul Marsh, D Joshi, John Doe) and Anyone (Nick Holden, John Doe)', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Floating',
                levels: [
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 2
                            },
                            {
                                user: 5
                            }
                        ]
                    },
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 3
                            },
                            {
                                user: 4
                            },
                            {
                                user: 6
                            }
                        ]
                    },
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 5
                            },
                            {
                                user: 6
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('id', 'name', 'status', 'levels')
                    response.body.id.should.be.a('number')
                    response.body.id.should.be.equal(1)
                    response.body.name.should.be.a('string')
                    response.body.name.should.be.equal('Tender Floating')
                    response.body.status.should.be.a('string')
                    response.body.status.should.be.equal('Active')
                    response.body.levels.should.be.an('array')
                    response.body.levels.should.have.lengthOf(3)
                    for (let i = 0; i < 3; i++) {
                        response.body.levels[i].should.be.an('object')
                        response.body.levels[i].should.have.all.keys('id', 'type', 'approvals')
                        response.body.levels[i].id.should.be.a('number')
                        response.body.levels[i].id.should.be.equal(i + 1)
                        response.body.levels[i].type.should.be.a('string')
                        switch (i) {
                            case 0: {
                                response.body.levels[i].type.should.be.equal('Sequential')
                                break
                            }
                            case 1: {
                                response.body.levels[i].type.should.be.equal('Round Robin')
                                break
                            }
                            case 2: {
                                response.body.levels[i].type.should.be.equal('Anyone')
                                break
                            }
                            default: { break }
                        }
                        response.body.levels[i].approvals.should.be.an('array')
                        switch (i) {
                            case 0: {
                                response.body.levels[i].approvals.should.have.lengthOf(2)
                                for (let j = 0; j < 2; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(2)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Elsa Ingram')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(5)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Nick Holden')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            case 1: {
                                response.body.levels[i].approvals.should.have.lengthOf(3)
                                for (let j = 0; j < 3; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(3)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Paul Marsh')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(4)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('D Joshi')
                                            break
                                        }
                                        case 2: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(6)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('John Doe')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            case 2: {
                                response.body.levels[i].approvals.should.have.lengthOf(2)
                                for (let j = 0; j < 2; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(5)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Nick Holden')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(6)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('John Doe')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            default: { break }
                        }
                    }
                }
                done()
            })
        })
        it('should create a new Workflow with three Levels of type Sequential (Elsa Ingram, Nick Holden), '
            + 'Anyone (Nick Holden, John Doe) and Round Robin (Paul Marsh, D Joshi, John Doe)', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Floating',
                levels: [
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 2
                            },
                            {
                                user: 5
                            }
                        ]
                    },
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 5
                            },
                            {
                                user: 6
                            }
                        ]
                    },
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 3
                            },
                            {
                                user: 4
                            },
                            {
                                user: 6
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('id', 'name', 'status', 'levels')
                    response.body.id.should.be.a('number')
                    response.body.id.should.be.equal(2)
                    response.body.name.should.be.a('string')
                    response.body.name.should.be.equal('Tender Floating')
                    response.body.status.should.be.a('string')
                    response.body.status.should.be.equal('Active')
                    response.body.levels.should.be.an('array')
                    response.body.levels.should.have.lengthOf(3)
                    for (let i = 0; i < 3; i++) {
                        response.body.levels[i].should.be.an('object')
                        response.body.levels[i].should.have.all.keys('id', 'type', 'approvals')
                        response.body.levels[i].id.should.be.a('number')
                        response.body.levels[i].id.should.be.equal(i + 1)
                        response.body.levels[i].type.should.be.a('string')
                        switch (i) {
                            case 0: {
                                response.body.levels[i].type.should.be.equal('Sequential')
                                break
                            }
                            case 1: {
                                response.body.levels[i].type.should.be.equal('Anyone')
                                break
                            }
                            case 2: {
                                response.body.levels[i].type.should.be.equal('Round Robin')
                                break
                            }
                            default: { break }
                        }
                        response.body.levels[i].approvals.should.be.an('array')
                        switch (i) {
                            case 0: {
                                response.body.levels[i].approvals.should.have.lengthOf(2)
                                for (let j = 0; j < 2; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(2)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Elsa Ingram')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(5)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Nick Holden')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            case 1: {
                                response.body.levels[i].approvals.should.have.lengthOf(2)
                                for (let j = 0; j < 2; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(5)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Nick Holden')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(6)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('John Doe')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            case 2: {
                                response.body.levels[i].approvals.should.have.lengthOf(3)
                                for (let j = 0; j < 3; j++) {
                                    response.body.levels[i].approvals[j].should.be.an('object')
                                    response.body.levels[i].approvals[j].should.have.all.keys('id', 'user')
                                    response.body.levels[i].approvals[j].id.should.be.a('number')
                                    response.body.levels[i].approvals[j].id.should.be.equal(j + 1)
                                    response.body.levels[i].approvals[j].user.should.be.an('object')
                                    response.body.levels[i].approvals[j].user.should.have.all.keys('id', 'name')
                                    switch (j) {
                                        case 0: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(3)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('Paul Marsh')
                                            break
                                        }
                                        case 1: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(4)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('D Joshi')
                                            break
                                        }
                                        case 2: {
                                            response.body.levels[i].approvals[j].user.id.should.be.equal(6)
                                            response.body.levels[i].approvals[j].user.name.should.be.equal('John Doe')
                                            break
                                        }
                                        default: { break }
                                    }
                                }
                                break
                            }
                            default: { break }
                        }
                    }
                }
                done()
            })
        })
        it('should reject the request as Approvers cannot occur more than once in a Level', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Floating',
                levels: [
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 2
                            },
                            {
                                user: 2
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.status.should.be.equal(409)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Approvers cannot occur more than once in a Level.')
                }
                done()
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
    describe('Update Workflow API - PATCH /api/workflow', () => {
        describe('Nick Holden is Approving Workflow 1 Level 1 (Sequential)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should reject the request as Elsa Ingram, the first Approver of the Sequential Level has not yet provided her input', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=1&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(406)
                        response.body.should.be.an('object')
                        response.body.should.have.all.keys('message')
                        response.body.message.should.be.a('string')
                        response.body.message.should.be.equal('Preceeding Approval has not yet been received.')
                    }
                    done()
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
        describe('Elsa Ingram is Approving Workflow 1 Level 1 (Sequential)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'eingram',
                    password: '12345678'
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
            it('should approve the request as Elsa Ingram is the first Approver of the Sequential Level and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=1&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[0].approvals[0].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('Paul Marsh is Approving Workflow 1 Level 2 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'pmarsh',
                    password: '12345678'
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
            it('should reject the request as all the Approvals from Level 1 (Sequential) have not yet been received', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=2&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(406)
                        response.body.should.be.an('object')
                        response.body.should.have.all.keys('message')
                        response.body.message.should.be.a('string')
                        response.body.message.should.be.equal('Approvals are yet to be received from the preceeding Level.')
                    }
                    done()
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
        describe('Nick Holden is Approving Workflow 1 Level 1 (Sequential)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should approve the request as the First Approver Elsa Ingram has already provided her input and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=1&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[0].approvals[1].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('Paul Marsh is Approving Workflow 1 Level 2 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'pmarsh',
                    password: '12345678'
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
            it('should approve the request as all the Approvals from Level 1 (Sequential) have been received and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=2&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[1].approvals[0].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('Nick Holden is Rejecting Workflow 1 Level 3 (Anyone)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should reject the request as all the Approvals from Level 2 (Round Robin) have not yet been received', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=3&workflow=1').set(Token).send({
                    action: 'Rejected'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(406)
                        response.body.should.be.an('object')
                        response.body.should.have.all.keys('message')
                        response.body.message.should.be.a('string')
                        response.body.message.should.be.equal('Approvals are yet to be received from the preceeding Level.')
                    }
                    done()
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
        describe('D Joshi is Approving Workflow 1 Level 2 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'djoshi',
                    password: '12345678'
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
            it('should approve the request as in case of a Round Robin level, order doesn\'t matter and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=2&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[1].approvals[1].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('John Doe is Rejecting Workflow 1 Level 2 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'jdoe',
                    password: '12345678'
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
            it('should approve the request as in case of a Round Robin level, order doesn\'t matter and should mark the Workflow as \'Terminated\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=3&level=2&workflow=1').set(Token).send({
                    action: 'Rejected'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Terminated')
                        response.body.levels[1].approvals[2].action.should.be.equal('Rejected')
                    }
                    done()
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
        describe('Nick Holden is Approving Workflow 1 Level 3 (Anyone)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should reject the request as the status of the Workflow is already \'Terminated\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=3&workflow=1').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(409)
                        response.body.should.be.an('object')
                        response.body.should.have.all.keys('message')
                        response.body.message.should.be.a('string')
                        response.body.message.should.be.equal('Workflow is currently in \'Terminated\' state.')
                    }
                    done()
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
        describe('Elsa Ingram is Approving Workflow 2 Level 1 (Sequential)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'eingram',
                    password: '12345678'
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
            it('should approve the request as Elsa Ingram is the first Approver of the Sequential Level and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=1&workflow=2').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[0].approvals[0].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('Nick Holden is Rejecting & Removing Workflow 2 Level 1 (Sequential)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should approve the request as the First Approver Elsa Ingram has already provided her input and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=1&workflow=2').set(Token).send({
                    action: 'Rejected & Removed'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[0].approvals[1].action.should.be.equal('Rejected & Removed')
                    }
                    done()
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
        describe('Nick Holden is Approving Workflow 2 Level 2 (Anyone)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'nholden',
                    password: '12345678'
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
            it('should approve the request as all the Approvals from Level 1 (Sequential) have been received and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=2&workflow=2').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[1].approvals[0].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('John Doe is Rejecting Workflow 2 Level 2 (Anyone)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'jdoe',
                    password: '12345678'
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
            it('should reject the request as the Level is of type \'Anyone\' and the Approval for it has already been received', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=2&workflow=2').set(Token).send({
                    action: 'Rejected'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(406)
                        response.body.should.be.an('object')
                        response.body.should.have.all.keys('message')
                        response.body.message.should.be.a('string')
                        response.body.message.should.be.equal('Approval has already been received for this Level.')
                    }
                    done()
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
        describe('John Doe is Approving Workflow 2 Level 3 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'jdoe',
                    password: '12345678'
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
            it('should approve the request as in case of a Round Robin level, order doesn\'t matter and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=3&level=3&workflow=2').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[2].approvals[2].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('D Joshi is Approving Workflow 2 Level 3 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'djoshi',
                    password: '12345678'
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
            it('should approve the request as in case of a Round Robin level, order doesn\'t matter and should mark the Workflow as \'Active\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=2&level=3&workflow=2').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Active')
                        response.body.levels[2].approvals[1].action.should.be.equal('Approved')
                    }
                    done()
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
        describe('Paul Marsh is Approving Workflow 2 Level 3 (Round Robin)', () => {
            before((done) => {
                Chai.request(Server).post('/api/access/login').send({
                    user: 'pmarsh',
                    password: '12345678'
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
            it('should approve the request as in case of a Round Robin level, order doesn\'t matter and should mark the Workflow as \'Executed\'', (done) => {
                Chai.request(Server).patch('/api/workflow?id=1&level=3&workflow=2').set(Token).send({
                    action: 'Approved'
                }).end((error, response) => {
                    if (error) { console.log(error) }
                    else {
                        response.status.should.be.equal(200)
                        response.body.status.should.be.equal('Executed')
                        response.body.levels[2].approvals[0].action.should.be.equal('Approved')
                    }
                    done()
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
    })
})
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
        it('should create a new Workflow with one Level of type \'Sequential\' with one Approver', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Floating',
                levels: [
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 2
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with one Level of type \'Round Robin\' with one Approver', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Receipt',
                levels: [
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 3
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with one Level of type \'Anyone\' with one Approver', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Processing',
                levels: [
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 4
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with one Level of type \'Sequential\' with two Approvers', (done) => {
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
                                user: 3
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with one Level of type \'Round Robin\' with two Approvers', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Receipt',
                levels: [
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 3
                            },
                            {
                                user: 4
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with one Level of type \'Anyone\' with two Approvers', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Processing',
                levels: [
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 4
                            },
                            {
                                user: 5
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two Levels of types \'Sequential\' and \'Round Robin\' with two Approvers in each', (done) => {
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
                                user: 3
                            }
                        ]
                    },
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 4
                            },
                            {
                                user: 5
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two levels of types \'Sequential\' and \'Anyone\' with two Approvers in each', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Processing',
                levels: [
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 4
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
                                user: 6
                            },
                            {
                                user: 7
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two Levels of types \'Round Robin\' and \'Sequential\' with two Approvers in each', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Floating',
                levels: [
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 2
                            },
                            {
                                user: 3
                            }
                        ]
                    },
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 4
                            },
                            {
                                user: 5
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two Levels of types \'Round Robin\' and \'Anyone\' with two Approvers in each', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Receipt',
                levels: [
                    {
                        type: 'Round Robin',
                        approvals: [
                            {
                                user: 3
                            },
                            {
                                user: 4
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
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two Levels of types \'Anyone\' and \'Round Robin\' with two Approvers in each', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Receipt',
                levels: [
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 3
                            },
                            {
                                user: 4
                            }
                        ]
                    },
                    {
                        type: 'Round Robin',
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
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
                }
                done()
            })
        })
        it('should create a new Workflow with two levels of types \'Anyone\' and \'Sequential\' with two Approvers in each', (done) => {
            Chai.request(Server).post('/api/workflow').set(Token).send({
                name: 'Tender Processing',
                levels: [
                    {
                        type: 'Anyone',
                        approvals: [
                            {
                                user: 4
                            },
                            {
                                user: 5
                            }
                        ]
                    },
                    {
                        type: 'Sequential',
                        approvals: [
                            {
                                user: 6
                            },
                            {
                                user: 7
                            }
                        ]
                    }
                ]
            }).end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    response.body.should.have.all.keys('message')
                    response.body.message.should.be.a('string')
                    response.body.message.should.be.equal('Workflow has been created successfully.')
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
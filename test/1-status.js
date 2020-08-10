// Environment
const DotEnv = require('dotenv')
DotEnv.config()

// Libraries
const Chai = require('chai')
const ChaiHttp = require('chai-http')
const Server = require('../app')
const Initiator = require('../configs/initiator')
const Should = Chai.should()
Chai.use(ChaiHttp)

describe('Application Status', () => {
    before((done) => {
        Initiator.loadDefaults().then(done)
    })
    describe('App Status API - GET /api/status ', () => {
        it('the response should be returned with status code 200', (done) => {
            Chai.request(Server).get('/api/status').end((error, response) => {
                if (error) { console.log(error) }
                else {
                    response.should.have.status(200)
                }
                done()
            })
        })
    })
})
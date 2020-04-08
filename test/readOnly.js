/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}${process.env.HOST_PREFIX}`
const appBaseRoute = supertest(appBaseURL)
const loadedTokenHeader = require('../auth0_tokens.json')

const timeOut = 50000

describe('fs.promise tests', function () {
  this.timeout(timeOut)

  it('get all products', function (done) {
    appBaseRoute
      .get('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        done()
      })
  })
})

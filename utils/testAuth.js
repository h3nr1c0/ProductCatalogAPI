/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
const expect = require('chai').expect

require('dotenv').config()

const testRoute = '/testRoute'

const baseURL = `http://localhost:${process.env.SERVER_PORT}`
const appBaseRoute = supertest(baseURL)
const timeOut = 125000

const loadedTokenHeader = require('../auth0_tokens.json')

describe('Test authentication with/without access token', function () {
  this.timeout(timeOut)

  it('Should fail without access token', function (done) {
    appBaseRoute
      .get(`${testRoute}`)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(401)
        console.log(res.body)
        done()
      })
  })

  it('Should return data using access token', function (done) {
    appBaseRoute
      .get(`${testRoute}`)
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        if (res) {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.not.be.empty
          expect(res.body).to.have.keys(['msg'])
          done()
        }
      })
  })
})

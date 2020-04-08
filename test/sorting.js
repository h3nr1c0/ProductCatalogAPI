/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}${process.env.HOST_PREFIX}`
const appBaseRoute = supertest(appBaseURL)
const loadedTokenHeader = require('../auth0_tokens.json')

const timeOut = 50000

describe('test filtering with sorting query', function () {
  this.timeout(timeOut)

  it('get switches only sorted by price descending', function (done) {
    appBaseRoute
      .get('?categories[]=switches&sort=price-desc')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array', 'res.body is not an array')
        expect(res.body).to.have.length.above(1, 'Returned array length less than 2')
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        expect(res.body).to.satisfy(ps => ps.every(p => (p.category === 'switches')), 'category does not match to filter')
        const last = res.body.pop()
        expect(res.body[0].price).to.be.above(last.price, 'Array is not sorted by price desc.')
        done()
      })
  })

  it('get switches only sorted by price ascending', function (done) {
    appBaseRoute
      .get('?categories[]=switches&sort=price-asc')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array', 'response is not an array')
        expect(res.body).to.have.length.above(1, 'Returned array length less than 2')
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        expect(res.body).to.satisfy(ps => ps.every(p => (p.category === 'switches')), 'category does not match to filter')
        const last = res.body.pop()
        expect(res.body[0].price).to.be.below(last.price, 'Array is not sorted by price asc.')
        done()
      })
  })

  it('should fail for unknown sort', function (done) {
    appBaseRoute
      .get('?categories[]=switches&sort=how')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.not.equal(200)
        expect(res.body).to.not.be.an('array', 'res.body is an array')
        done()
      })
  })
})

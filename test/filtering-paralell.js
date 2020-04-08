/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const parallel = require('mocha.parallel');
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}${process.env.HOST_PREFIX}`
const appBaseRoute = supertest(appBaseURL)
const loadedTokenHeader = require('../auth0_tokens.json')
const timeOut = 50000

parallel('Paralell test filtering query', function () {
  this.timeout(timeOut)

  it('get switches only', function (done) {
    const cat = 'switches'
    appBaseRoute
      // ?categories[]=switches&categories[]=sensors&sort=price-desc
      .get(`?categories[]=${cat}`)
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        expect(res.body).to.satisfy(ps => ps.every(p => (p.category === cat)), 'category does not match to filter')
        done()
      })
  })

  it('get sensors and luminaires only', function (done) {
    const filterCategories = ['sensors', 'luminaires']
    appBaseRoute
      // ?categories[]=switches&categories[]=sensors&sort=price-desc
      .get(`?categories[]=${filterCategories[0]}&categories[]=${filterCategories[1]}`)
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        expect(res.body).to.satisfy(ps => ps.every(p => (filterCategories.indexOf(p.category) > -1)), 'category does not match to filter')
        done()
      })
  })

  it('get sensors only', function (done) {
    const cat = 'sensors'
    appBaseRoute
      // ?categories[]=switches&categories[]=sensors&sort=price-desc
      .get(`?categories[]=${cat}`)
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        expect(res.body).to.satisfy(ps => ps.every(p => (p.category === cat)), 'category does not match to filter')
        done()
      })
  })
})

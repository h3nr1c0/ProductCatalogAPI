/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect
const { eqProduct } = require('../utils/product-helper')
require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}${process.env.HOST_PREFIX}`
const appBaseRoute = supertest(appBaseURL)
const loadedTokenHeader = require('../auth0_tokens.json')

const timeOut = 50000

const isInArray = (arr, findItem) => {
  return arr.filter(item => eqProduct(item, findItem)).length > 0
}

describe('test adding products', function () {
  this.timeout(timeOut)

  const deleteProduct = {
    category: 'switches',
    name: 'valid light',
    brand: 'Osramity',
    model: 'Lighty',
    price: 50
  }
  it('Add product to be deleted with access token', function (done) {
    const newProduct = deleteProduct
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(newProduct)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(201)
        expect(res.body).to.be.empty
        // get all products and get last item from response array for comparison
        appBaseRoute
          .get('')
          .set(loadedTokenHeader)
          .set('accept-version', process.env.API_VERSION)
          .end(function (_err, res) {
            if (_err) throw _err
            const productName = newProduct.name.split(' ') // split to 2 strings, name is a validated string with 1 white space
            newProduct.picture = `${process.env.DUMMY_IMAGE_URL}${productName[0]}+${productName[1]}`
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array').that.is.not.empty
            expect(isInArray(res.body, newProduct)).to.be.true
            done()
          })
      })
  })

  it('Fail to delete switch product without access token', function (done) {
    appBaseRoute
      .delete('')
      .set('accept-version', process.env.API_VERSION)
      .send({})
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(401)
        done()
      })
  })

  it('OK to delete previously added product with access token', function (done) {
    appBaseRoute
      .delete('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(deleteProduct)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        // get all products and check if deleted is still there
        appBaseRoute
          .get('')
          .set(loadedTokenHeader)
          .set('accept-version', process.env.API_VERSION)
          .end(function (_err, res) {
            if (_err) throw _err
            expect(res.statusCode).to.equal(200)
            const resultArr = res.body
            expect(resultArr).to.be.an('array')
            expect(isInArray(resultArr, deleteProduct)).to.be.false
            done()
          })
      })
  })
})

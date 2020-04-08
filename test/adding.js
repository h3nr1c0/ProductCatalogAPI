/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}${process.env.HOST_PREFIX}`
const appBaseRoute = supertest(appBaseURL)
const loadedTokenHeader = require('../auth0_tokens.json')

const timeOut = 50000

const randomString = (length, chars) => {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

const randomAlpha = (chars) => {
  return randomString(chars, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
}

const getNewProduct = (category) => {
  return {
    category: category,
    name: `${randomAlpha(8)} ${randomAlpha(8)}`,
    brand: randomAlpha(8),
    model: randomAlpha(8),
    price: Math.floor((Math.random() * 500) + 1)
  }
}

describe('test adding products', function () {
  this.timeout(timeOut)

  const validSwitch = {
    category: 'switches',
    name: 'valid name',
    brand: 'Osram',
    model: 'Lighty',
    price: 10
  }

  it('Fail to add new switch product without access token', function (done) {
    appBaseRoute
      .post('')
      .set('accept-version', process.env.API_VERSION)
      .send(validSwitch)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(401)
        done()
      })
  })

  it('OK to add valid new switch product with access token', function (done) {
    const newProduct = getNewProduct('switches')
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
            const lastProduct = res.body.pop()
            expect(lastProduct).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
            expect(lastProduct).to.be.eql(newProduct, 'Added equals to the last product in the catalog')
            done()
          })
      })
  })

  it('OK to add new sensor product with access token', function (done) {
    const newProduct = getNewProduct('sensors')
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
            const lastProduct = res.body.pop()
            expect(lastProduct).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
            expect(lastProduct).to.be.eql(newProduct, 'Added equals to the last product in the catalog')
            done()
          })
      })
  })

  it('Fail to add product with name as 1 alphanum. word', function (done) {
    const invalidItem = {
      category: 'switches',
      name: 'invalidname',
      brand: 'Osram',
      model: 'Lighty',
      price: 10
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('Fail to add product with name as 2 alphanum. word', function (done) {
    const invalidItem = {
      category: 'switches',
      name: 'invalid0 name2',
      brand: 'Osram',
      model: 'Lighty',
      price: 10
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('fail to add product with bad category', function (done) {
    const invalidItem = {
      category: 'stitches',
      name: 'valid name',
      brand: 'Leoko',
      model: 'Plast',
      price: 10
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('fail to add product with short brand name', function (done) {
    const invalidItem = {
      category: 'switches',
      name: 'valid name',
      brand: 'Lul',
      model: 'Plast',
      price: 10
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('fail to add product with too long model name', function (done) {
    const invalidItem = {
      category: 'switches',
      name: 'valid name',
      brand: 'Lul',
      model: 'SuperPlasticSomething',
      price: 10
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('fail to add product with price out of range', function (done) {
    const invalidItem = {
      category: 'switches',
      name: 'valid name',
      brand: 'Lul',
      model: 'Plastic',
      price: 1000
    }
    appBaseRoute
      .post('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .send(invalidItem)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('get all products', function (done) {
    appBaseRoute
      .get('')
      .set(loadedTokenHeader)
      .set('accept-version', process.env.API_VERSION)
      .end(function (_err, res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        expect(res.body[0]).to.contain.keys(['category', 'name', 'brand', 'model', 'price', 'picture'])
        done()
      })
  })
})

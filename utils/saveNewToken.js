/* eslint-disable no-undef */
const supertest = require('supertest')
const request = require('request')
var expect = require('chai').expect
const fs = require('fs')

require('dotenv').config()

const timeOut = 50000

describe('Get auth0 access token, please wait ...', function () {
  this.timeout(timeOut)
  // auth0 Authenticate User
  const auth0route = supertest(`https://${process.env.AUTH0_DOMAIN}`)
  const auth0TokenRequest = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: `${process.env.AUTH0_APP_BASE_URL}/api/v2/`,
    grant_type: 'client_credentials'
  }
  const tokenFileName = './auth0_tokens.json'

  it('Auth0 token saved to file', function (done) {
    auth0route
      .post('/oauth/token')
      .send(auth0TokenRequest)
      .end(function (_err, res) {
        if (_err) { console.log(_err) }
        if (res) {
          const token = res.body.access_token
          const loadedTokenHeader = {
            authorization: 'Bearer ' + token
          }
          fs.writeFile(tokenFileName, JSON.stringify(loadedTokenHeader), (_err) => {
            console.log(`Token saved to file ${tokenFileName}`)
            console.log('Access token:\n' + JSON.stringify(loadedTokenHeader))
            done()
          })
        } else {
          throw new Error('No response from auth0')
        }
      })
  })
})

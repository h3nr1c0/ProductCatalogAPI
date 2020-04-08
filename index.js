const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
var passport = require('passport')
var Auth0Strategy = require('passport-auth0')
var jwt = require('express-jwt')
var jwks = require('jwks-rsa')
var testRoute = require('./routes/testRoute')
var catalogRouteV1 = require('./routes/catalogRouteV1')
var catalogRouteV2 = require('./routes/catalogRouteV2')
var versionRoutes = require('express-routes-versioning')()

require('dotenv').config()
const port = process.env.SERVER_PORT

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || `http://localhost:${port}`
},
function (accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile)
})

passport.use(strategy)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(logger('dev'))

// Rather than checking for a token within our controller
// we'll use a middleware so if the token is invalid we'll
// stop further execution of the request
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_APP_BASE_URL}/.well-known/jwks.json`
  }),
  audience: `${process.env.AUTH0_APP_BASE_URL}/api/v2/`,
  algorithms: ['RS256']
})

app.use(passport.initialize())
app.use(passport.session())

// Handle auth failure error messages
app.use(function (req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash('error', req.query.error)
  }
  if (req && req.query && req.query.error_description) {
    req.flash('error_description', req.query.error_description)
  }
  // req.version is used to determine the version
  req.version = req.headers['accept-version']
  next()
})

// ROUTES FOR OUR API
// ----------------------------------------------------------------------------------------------------------------
app.use('/testRoute', authCheck)
app.use('/', testRoute)

app.use(process.env.HOST_PREFIX, authCheck)

app.use('/', versionRoutes({
  '1.0.0': catalogRouteV1,
  '~2.1.1': catalogRouteV2
}))

// START THE SERVER
const server = app.listen(port)

/// HANDLE SERVER CLOSING
server.on('close', () => {
  console.warn('Closing server ...')
})

process.on('exit', () => {
  console.warn('Process closed')
})

// Handle ^C
process.on('SIGINT', () => {
  server.close(() => {
    console.warn('Server closed')
  })
})

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    })
  })
}

console.info(`server running on: http://localhost:${port}`)

// unknown routes
app.get('**', (req, res) => res.status(404).send('Not Found'))

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
const mongoSecrets = require('./secrets-mongo')

require('dotenv').config()
const PORT = process.env.SERVER_PORT

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || `http://localhost:${PORT}`
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

//* **************   Mongo ****************** */

const MongoClient = require('mongodb').MongoClient
const connectionString = mongoSecrets.getMongoConnectionStr()
const dbName = process.env.DB_NAME
const collectioName = process.env.COLLECTION_NAME

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.info('Connected to Database')
    const db = client.db(dbName)
    const dbCatalog = db.collection(collectioName)
    app.locals.dbCatalog = dbCatalog

    // START THE SERVER
    const server = app.listen(PORT)

    // Handle ^C close DB
    process.on('SIGINT', _ => {
      console.info('SIGINT signal received.')
      console.warn('Closing http server.')
      server.close(_ => {
        console.info('Http server closed.')
        // not forced close DB
        client.close(false)
          .then(_ => {
            console.info('MongoDb connection closed.')
          })
          .catch(e => {
            console.error(e)
            client.close(true)
              .then(_ => {
                console.warn('MongoDb connection closed forcefully.')
              })
              .catch(
                console.error('MongoDb connection can NOT be closed forcefully.')
              )
          })
      })
    })

    /// HANDLE SERVER CLOSING
    server.on('close', () => {
      console.warn('Closing server ...')
    })

    /// HANDLE SERVER CLOSING
    process.on('exit', () => {
      client.close()
        .then(
          console.warn('Server closed')
        )
    })
  })
// ---------------------------------------------------------------------------

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

console.info(`server running on: http://localhost:${PORT}`)

// root
app.get('', (req, res) => res.status(403).send(`add ${process.env.HOST_PREFIX} to end of path`))

// unknown routes
app.get('**', (req, res) => res.status(404).send('Not Found'))

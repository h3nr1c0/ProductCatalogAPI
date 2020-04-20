const secret = require('./secret.json')
const fsp = require('fs').promises

require('dotenv').config()

const mongoAuth = secret.mongoAtlasAuth

const getMongoConnectionStr = _ => {
  return `mongodb+srv://${mongoAuth.name}:${mongoAuth.password}@yay-kclbk.mongodb.net/test?retryWrites=true&w=majority`
}

const MongoClient = require('mongodb').MongoClient
const connectionString = getMongoConnectionStr()

const dbName = 'products'
const collectioName = 'catalog'
const catalogFileName = `./${process.env.PRODUCT_CATALOG_PATH}/${process.env.PRODUCT_CATALOG_FILE}`

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    fsp.readFile(catalogFileName)
      .then(data => {
        const products = JSON.parse(data)

        const db = client.db(dbName)
        const dbCollection = db.collection(collectioName)

        dbCollection.insertMany(products)
          .then(result => {
            console.log('catalog data uploaded')
            // res.redirect('/') // redirect to root
          })
          .catch(error => console.error(error))
      })
      .catch(error => console.error(error))
  })

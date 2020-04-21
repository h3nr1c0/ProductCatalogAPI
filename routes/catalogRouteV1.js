// Version 1
const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const { validateProduct, createProduct, sortProducts } = require('../src/product')

require('dotenv').config()

router
// POST Add new product
  /**
  * @api {post} /catalog/products Add new product
  * @apiVersion 1.0.0
  * @apiName Add product
  * @apiGroup Products
  * @apiPermission authenticated user
  *
  * @apiParam (Request body) {String="switches", "sensors", "luminaires"} category Product category
  * @apiParam (Request body) {String{2..30}} name Product name
  * @apiParam (Request body) {String{4..16}} brand Product brand
  * @apiParam (Request body) {String{3..10}} model Product model
  * @apiParam (Request body) {Number{1-500}} price Product price
  *
  * @apiExample {js} Example usage:
  * const data =  {"category": "luminaires",
  *          "name": "Sample name 1",
  *          "brand": "Brand name 1",
  *          "model": "Model name 1",
  *          "price": 19.99 }
  *
  * $http.defaults.headers.common["Authorization"] = access_token;
  *
  * @apiSuccessExample {json} Success response:
  *     HTTPS 201 OK
  *
  * @apiUse UnauthorizedError
  */
  .post(process.env.HOST_PREFIX, validateProduct(), async (req, res, next) => {
    const dbCatalog = req.app.locals.dbCatalog
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    // create mutable object for mongo DB, mongo adds _id
    const product = createProduct(req.body, true) // object must be extensible to be mutable
    dbCatalog.insertOne(product)
      .then(_ => res.status(201).send())
      .catch(err => res.status(422).send(err))
  })

// ----------------------------------------------------------------------------------------------------------------
// get products filtered and sorted
  /**
      * @api {get} /catalog/products?categories[]=switches&categories[]=sensors&sort=price-desc
      * @apiVersion 1.0.0
      * @apiName GetProducts
      * @apiGroup Products
      * @apiPermission authenticated user
      *
      * @apiParam {String="switches", "sensors", "luminaires"} categories     Filter by these categories separated by &
      * @apiParam {String="name-asc", "name-desc", "price-asc", "price-desc"} sort   Sort by this
      *
      * @apiParamExample {String} Request-Example:
      * "?categories[]=luminaires&categories[]=sensors&sort=price-desc"
      *
      * @apiExample {js} Example usage:
      * $http.defaults.headers.common["Authorization"] = token;
      *
      * @apiSuccess (products) {Object[]} Body Filtered and/or sorted products
      *
      * @apiSuccessExample {json} Success response:
      *     HTTPS 200 OK
      *     [{"category": "luminaires",
      *          "name": "Sample name 1",
      *          "brand": "Brand name 1",
      *          "model": "Model name 1",
      *          "price": 19.99 },
      *      {"category": "sensors",
      *          "name": "Sample name 2",
      *          "brand": "Brand name 2",
      *          "model": "Model name 2",
      *          "price": 59.99 }]
      *
      * @apiUse UnauthorizedError
      */
  .get(process.env.HOST_PREFIX, async (req, res) => {
    const dbCatalog = req.app.locals.dbCatalog
    const query = req.query
    const categories = query.categories
    let findQuery = {}
    if (categories) {
      findQuery = { category: { $in: categories } }
    }
    // find all by query, exclude mongo field _id from results
    dbCatalog.find(findQuery, { projection: { _id: 0 } }).toArray()
      .then(results => {
        // sort by criteria in query
        const sorted = sortProducts(results, query.sort)
        res.status(200).send(sorted)
      })
      .catch(err => res.status(422).send(err))
  })

module.exports = router

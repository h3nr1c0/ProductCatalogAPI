// Version 2
const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const { validateProduct, createProduct, saveProduct, readProducts } = require('../src/product')

require('dotenv').config()

router
  .post(process.env.HOST_PREFIX, validateProduct(), async (req, res, next) => {
    res.status(501).send('NOT IMPLEMENTED !')
  })

  // ----------------------------------------------------------------------------------------------------------------
  // get products
  // Example request: /catalog/products?categories[]=switches&categories[]=sensors&sort=price-desc
  .get(process.env.HOST_PREFIX, async (req, res) => {
    res.status(501).send('NOT IMPLEMENTED !')
  })

module.exports = router

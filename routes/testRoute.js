const express = require('express')
const router = express.Router()

// on routes that end in /catalog/products
router
  .get('/testRoute', function (req, res, next) {
    if (req.user) {
      res.status(201).json({ msg: 'logged in' })
    } else {
      // redirects to 0auth login/ sign up page
      res.json({ msg: 'NOT logged in' })
    }
  })

module.exports = router

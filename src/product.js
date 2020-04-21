const fsp = require('fs').promises
const { check } = require('express-validator')
const { eqProduct } = require('../utils/product-helper')

require('dotenv').config()

const catalogFileName = `./${process.env.PRODUCT_CATALOG_PATH}/${process.env.PRODUCT_CATALOG_FILE}`

// validate fields of the product
exports.validateProduct = () => {
  return [
    check('category').isIn(['switches', 'sensors', 'luminaires']),
    check('name')
      .isLength({ min: 3, max: 30 })
      .custom((name) => {
        const nameWords = name.split(' ') // split to words
        const alphaWords = nameWords.filter(w => /^[a-z]+$/i.test(w)) // get words with a-z chars.
        // compare orig. words with alpha words
        if ((Array.isArray(nameWords) && nameWords.length > 1) && (alphaWords.length === nameWords.length)) {
          return Promise.resolve()
        } else {
          throw new Error(`Invalid name ${name}, should be 2 alphanumeric words`)
        }
      }),
    check('brand')
      .isLength({ min: 4, max: 16 }),
    check('model')
      .isLength({ min: 3, max: 10 }),
    check('price')
      .isCurrency({ min: 1, max: 500 })
  ]
}

// return immutable object with new field picture set by name
exports.createProduct = (body, extensible = false) => {
  try {
    const { category, name, brand, model, price } = body
    const productName = name.split(' ') // split to 2 strings, name is a validated string with 1 white space
    const picture = `${process.env.DUMMY_IMAGE_URL}${productName[0]}+${productName[1]}`
    const newObj = {
      category,
      name,
      brand,
      model,
      price,
      picture
    }
    if (extensible) {
      return newObj
    } else {
      return Object.freeze(newObj)
    }
  } catch (err) {
    return undefined
  }
}

// save products to file
exports.saveProduct = async (product) => {
  let products
  try {
    const data = await fsp.readFile(catalogFileName)
    products = JSON.parse(data)
    if (products && Array.isArray(products)) {
      products.push(product)
      await fsp.writeFile(catalogFileName, JSON.stringify(products))
    } else {
      throw new Error(`Invalid data in file ${catalogFileName}`)
    }
  } catch (error) {
    throw new Error(`File read error: ${catalogFileName}`)
  }
}

// Filter products by categories, or all if no categories
const filterProducts = (products, categories) => {
  if (categories) {
    return products.filter(p => categories.indexOf(p.category) > -1)
  } else {
    return products
  }
}

// sort products by allowed sort options, error otherwise
exports.sortProducts = (products, sort) => {
  if (sort) {
    switch (sort) {
      case 'name-asc':
        return products.sort((a, b) => a.name - b.name)
      case 'name-desc':
        return products.sort((a, b) => b.name - a.name)
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price)
      default:
        throw new Error(`Unknown sort type: ${sort}`)
    }
  } else {
    return products
  }
}

// read products from file and process them by received query
exports.readProducts = async (query) => {
  const data = await fsp.readFile(catalogFileName)
  const products = JSON.parse(data)
  const filtered = filterProducts(products, query.categories)
  return exports.sortProducts(filtered, query.sort)
}

const filterBy = (arr, filterBy) => arr.filter(function (item) {
  for (var key in filterBy) {
    if (item[key] === undefined || item[key] !== filterBy[key]) {
      return false
    }
  }
  return true
})

// read products from file and process them by received query
exports.deleteProduct = async (query) => {
  const data = await fsp.readFile(catalogFileName)
  const products = JSON.parse(data)
  // const deleteArr = filterBy(products, { name: query.name })
  const updatedArr = this.filterArr(products, query)
  // const updatedArr = products.filter(item => !EqProduct(item, query))
  await fsp.writeFile(catalogFileName, JSON.stringify(updatedArr))
  // .then(_ => { return })
}

exports.filterArr = (arr, delItem) => {
  return arr.filter(item => !eqProduct(item, delItem))
}

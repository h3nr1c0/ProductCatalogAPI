// Helpers for products

exports.eqProduct = (prodA, prodB) => {
  if ((prodA.category === prodB.category) && (prodA.name === prodB.name) && (prodA.model === prodB.model)) {
    return true
  } else return false
}

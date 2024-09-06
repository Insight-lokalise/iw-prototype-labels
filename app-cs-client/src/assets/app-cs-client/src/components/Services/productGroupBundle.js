
function getContractLineItems(contract, items = [], isRoutineOrderEnabled = false) {
  const { lineitems } = contract[0]
  const setContents = lineitems.reduce((acc, curr) => {
    if (!curr.callForPrice && curr.selected && curr.showPriceOnWeb && !curr.discontinued && curr.showBuyButton) {
      const currentProduct = items.find((item) => item.materialId === curr.materialId)
      if(!isRoutineOrderEnabled || currentProduct.preSelect) {
        acc[curr.materialId] = { qty: curr.qty, enforceEnrolment: currentProduct?.enrollment }
      }
    }
    return acc
  }, {})
  return Object.keys(setContents).length ? setContents : undefined
}

// Strips NONE & qty 0 parts from cart
function stripNONE(cart) {
  return Object.keys(cart).reduce((strippedCart, listId) => {
    const pSet = cart[listId]
    const strippedPSet = Object.keys(pSet).reduce((strippedPSet, productId) => {
      if (pSet[productId].qty && productId !== 'NONE') strippedPSet[productId] = pSet[productId]
      return strippedPSet
    }, {})
    if (Object.keys(strippedPSet).length) strippedCart[listId] = strippedPSet
    return strippedCart
  }, {})
}


export { getContractLineItems, stripNONE }

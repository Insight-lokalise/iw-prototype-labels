import axios from 'axios'

const ADD_TO_PERSONAL_PRODUCTS_URL = `/insightweb/favitems/new`

export default function addToPersonalProducts(productList) {
  return axios
    .post(`${window.location.origin}${ADD_TO_PERSONAL_PRODUCTS_URL}`, productList)
    .then(({ data }) => {      

      const depIdList = data.enrollmentMaterials ? data.enrollmentMaterials : []
      const hasDEP = depIdList.length > 0
      const invalidProducts = findInvalidObjects({ productList, addedProducts: data.products, depIdList })      
      return {
        ...data,
        invalidProducts,
        hasDEP,
      }
    })
    .catch(error => {
      console.warn(`Failed to add item(s) ${productList.join(', ')} to cart`)
      throw error
    })
}

function findInvalidObjects({ productList, addedProducts, depIdList }) {
  const addedProductsList = addedProducts ? Object.keys(addedProducts).reduce((acc, curr) => {
    acc.push(addedProducts[curr].materialId)
    return acc
  }, []) : []
  //invalid objects are items that are not added and not a DEP item
  return productList.filter(product => !addedProductsList.includes(product) && !depIdList.includes(product))
}
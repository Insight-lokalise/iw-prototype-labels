const BASE_ROUTE = `/${window.location.pathname
    .split('/')
    .splice(2, 1)
    .join('/')}`

export default {
    ACTIVITY_LOG: `${BASE_ROUTE}/activity`,
    ADD_EDIT_PRODUCTS: (productSetId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/prod/${productSetId || ':id'}/edit`,
    CREATE_CATEGORY: `${BASE_ROUTE}/create`,
    CREATE_PRODUCT_GROUP: categoryId => `${BASE_ROUTE}/${categoryId || ':id'}/pg/create`,
    CREATE_PRODUCT_SET: (productGroupId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/pg/${productGroupId || ':id'}/ps/create`,
    DUPLICATE_CATEGORY: categoryId => `${BASE_ROUTE}/${categoryId || ':id'}/duplicate`,
    DUPLICATE_PRODUCT_GROUP: (productGroupId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/pg/${productGroupId || ':id'}/duplicate`,
    DUPLICATE_PRODUCT_SET: (productSetId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/ps/${productSetId || ':id'}/duplicate`,
    EDIT_CATEGORY: categoryId => `${BASE_ROUTE}/${categoryId || ':id'}/edit`,
    EDIT_PRODUCT_GROUP: (productGroupId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/pg/${productGroupId || ':id'}/edit`,
    EDIT_PRODUCT_SET: (productSetId, categoryId) => `${BASE_ROUTE}/${categoryId || ':catId'}/ps/${productSetId || ':id'}/edit`,
    SEARCH: `${BASE_ROUTE}/search`,
    SETTINGS: `${BASE_ROUTE}/settings`,
    SHARE_CATEGORY: categoryId => `${BASE_ROUTE}/${categoryId || ':id'}/shareCategory`,
    SHARE_PRODUCT_GROUP: productGroupId => `${BASE_ROUTE}/${productGroupId || ':id'}/shareProductGroup`,
    STANDARDS: `${BASE_ROUTE}`,
}
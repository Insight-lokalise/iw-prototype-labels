import { l } from '@insight/toolkit-utils'
import { handleShareResponse, isProductGroup } from './helpers'

import axios, { GET, POST } from './axiosConfig'
import { i18n, getCurrentLocale } from '@insight/toolkit-utils'

let fetchCategoriesCache = {}

export function getTranslations() {
  const locale = getCurrentLocale("insight_current_locale", "insight_locale")
  const isDebranded = window && window.Insight && window.Insight.b2bLoginInfo && window.Insight.b2bLoginInfo.debrandSite
  return i18n({ app: 'app-cs-standards', isDebranded, locale })
}

export function fetchActivityLog({ page, wId }) {
  return axios({
    method: GET,
    url: `cs/activities`,
    params: { page, wId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to load activity log`, error)
      throw error
    })
}

export function fetchCategories({ wId }) {
  const trimmedWebgroupId = wId?.toString()?.trim() ?? null // null is expected for standards-manager
  if (fetchCategoriesCache[trimmedWebgroupId]) {
    return Promise.resolve(fetchCategoriesCache[trimmedWebgroupId])
  }
  else {
    return axios({
      method: GET,
      url: `cs/categories`,
      params: { wId: trimmedWebgroupId },
    }).then(res => {
      fetchCategoriesCache[trimmedWebgroupId] = res
      return res
    })
    .catch(error => {
      console.warn(`Failed to fetch categories`, error)
      throw error
    })
  }
}

export function fetchCategory({ categoryId, wId }) {
  return axios({
    method: GET,
    url: `cs/categories/${categoryId}`,
    params: { wId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch category`, error)
      throw error
    })
}

export function fetchImageAlbum({ wId }) {
  return axios({
    method: GET,
    url: `cs/images/${wId}`,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch image album`, error)
      throw error
    })
}

export function fetchFindAndReplace({ lang, materialId, wId }) {
  return axios({
    method: GET,
    url: `/cs/catalog/find-replace`,
    params: { lang, matId: materialId, wId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch matching product sets`, error)
      throw error
    })
}

export function fetchIpsContracts({ wId }) {
  return axios({
    method: GET,
    url: `/contracts/ips/webgroup/${wId}?filters=titleAbbreviation`,
  })
    .then(({ data }) => Object.keys(data).map(id => {
      const idText = id === 'Open Market' ? "" : `, #${id}`
      const text = `${data[id].titleAbbreviation}${idText}`
      return ({ text, value: id })
    })).catch(error => {
      console.warn(`Failed to fetch IPS contracts`, error)
      throw error
    })
}

export function fetchLabFeesByLabConfig({ labConfig }) {
  return axios({
    method: GET,
    url: `/lab-fees/${labConfig}`,
  })
    .then(res => res.data.sort())
    .catch(error => {
      console.warn(`Failed to fetch lab fees`, error)
      throw error
    })
}

export function fetchProductGroupsByCategory({ categoryId, wId }) {
  return axios({
    method: GET,
    url: `cs/productGroups`,
    params: { categoryId, wId },
  }).catch(error => {
    console.warn(`Failed to fetch product groups`, error)
    throw error
  })
}

export function fetchProductGroup({ productGroupId, wId, categoryId }) {
  return axios({
    method: GET,
    url: `cs/productGroups/${productGroupId}`,
    params: { wId, categoryId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch product groups`, error)
      throw error
    })
}

export function fetchProductInformation({ contractId, locale, materialId }) {
  return axios({
    method: POST,
    url: `/productInformation`,
    params: { contractId, locale, matId: materialId }
  }).catch(error => {
    console.warn(`Failed to fetch PDP information`, error)
    throw error
  })
}

export function fetchProductSet({ productSetId, wId, locale, categoryId }) {
  return axios({
    method: GET,
    url: `cs/productSets/${productSetId}`,
    params: { wId, locale, categoryId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch product set`, error)
      throw error
    })
}

export function fetchProductSetsByProductGroup({ productGroupId, wId }) {
  return axios({
    method: GET,
    url: `cs/productSets`,
    params: { productGroupId, wId },
  }).catch(error => {
    console.warn(`Failed to fetch product sets`, error)
    throw error
  })
}

export function fetchProductsByProductSet({ locale, productSetId, wId, categoryId }) {
  return axios({
    method: GET,
    url: `cs/items`,
    params: { locale, productSetId, wId, categoryId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch products`, error)
      throw error
    })
}

export function fetchSearchResults({ searchString, wId }) {
  const lang = l()
  return axios({
    method: POST,
    url: `cs/search`,
    data: { q: searchString, wId, lang },
  }).catch(error => {
    console.warn(`Failed to fetch search results`, error)
    throw error
  })
}

export function fetchSettings({ wId }) {
  return axios({
    method: GET,
    url: `cs/settings`,
    params: { wId },
  }).catch(error => {
    console.warn(`Failed to fetch settings`, error)
    throw error
  })
}

export function fetchSharedWith(entity) {

  const url = isProductGroup(entity) ? `cs/productGroups/share/${entity.id}` : `cs/categories/share/${entity.id}`

  return axios({
    method: GET,
    url,
  })
    .then(handleShareResponse)
    .catch(error => {
      console.warn(`Failed to fetch settings`, error)
      throw error
    })
}

export function fetchTags({ wId }) {
  return axios({
    method: GET,
    url: `cs/tags`,
    params: { wId },
  }).catch(error => {
    console.warn(`Failed to fetch tags`, error)
    throw error
  })
}

export function fetchWebGroup({ wId }) {
  return axios({
    method: GET,
    url: `/webGroups/${wId}`,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to fetch web group`, error)
      throw error
    })
}

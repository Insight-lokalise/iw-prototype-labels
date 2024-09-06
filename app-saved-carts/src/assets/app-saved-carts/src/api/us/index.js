import axios from 'axios'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { i18n, getCurrentLocale, getUTCTimeStamp } from '@insight/toolkit-utils'
import { INSIGHT_LOCALE_COOKIE_NAME } from '../../lib'

export function fetchCartTemplate(id) {
  return axios.get(`savedCartTemplate/${id}`).catch(error => {
    console.warn('Failed to load saved cart', error)
    throw error
  })
}

export function fetchAllCartTemplates() {
  return axios.get(`savedCartTemplates`).catch(error => {
    console.warn('Failed to load saved carts', error)
    throw error
  })
}

export function delCartTemplate(id) {
  return axios.delete(`savedCartTemplate/${id}`).catch(error => {
    console.warn('Failed to delete saved cart', error)
    throw error
  })
}

export function addToCart(savedCartId) {
  const clientBrowserDate = getUTCTimeStamp()
  return axios
    .post('transaction/loadsavedcart', { clientBrowserDate, savedCartId })
    .catch(error => {
      console.warn('Failed to add to cart', error)
      throw error
    })
}

export function getTranslations() {
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite
  return i18n({ app: 'app-saved-carts', isDebranded, locale }).then(labels =>
    setToolkitLabels(labels)
  )
}

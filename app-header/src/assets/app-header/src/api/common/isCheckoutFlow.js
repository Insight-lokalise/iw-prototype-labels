import { CHECKOUT_ROUTES } from './constants'

export default function isCheckoutFlow() {
  
  const pathname = window.location.pathname
  let isCheckout = false

  Object.keys(CHECKOUT_ROUTES).forEach((key) => {
    if(pathname.indexOf(CHECKOUT_ROUTES[key]) > -1) {
      isCheckout = true
    }    
  })

  return isCheckout
}

export function isCartPage() {
  const pathname = window.location.pathname
  return pathname.indexOf('/cart') > -1
}

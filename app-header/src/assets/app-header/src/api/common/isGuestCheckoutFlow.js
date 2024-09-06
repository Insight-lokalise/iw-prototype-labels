import { GUEST_CHECKOUT_ROUTES } from './constants'

export function getLocation() {
  return window.location.pathname;
};

export function isGuestCheckoutFlow(pathname = '') {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }
  for (const key in GUEST_CHECKOUT_ROUTES) {
    if (pathname.indexOf(GUEST_CHECKOUT_ROUTES[key]) > -1) {
      return true;
    }
  }
  return false;
}

import getSEWPHomeURL from './getSEWPHomeURL'

export default function getHomeURL({ isSEWPUser, isLoggedIn }) {
  return isLoggedIn ? '/insightweb/welcome' : isSEWPUser ? getSEWPHomeURL() : '/'
}

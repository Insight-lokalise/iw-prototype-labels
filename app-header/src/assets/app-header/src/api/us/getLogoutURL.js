export default function getLogoutURL() {
  window.localStorage.removeItem("persist:checkout")
  window.location.href = '/insightweb/logout'
}

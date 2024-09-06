import getCreateAccountRoute from "./getCreateAccountRoute"

const learnMore = (locale) =>  `https://www.insight.com/${locale}/what-we-do/supply-chain-optimization/procurement-platform.html`
const scheduleADemo = (locale) => `https://www.insight.com/${locale}/about/schedule-a-demo.html`

export function jumpToAccountLocked() {
  window.location = '/insightweb/accountLocked'
}

export function jumpToCreateAccount() {
  window.location = getCreateAccountRoute(false)
}

export function jumpToForgotPassword() {
  window.location = '/insightweb/login?form=forgotPassword'
}

export function jumpToLearnMore(locale) {
  window.location.replace(learnMore(locale))
}

export function jumpToLogin() {
  window.location = '/insightweb/login'
}

export function jumpToPasswordExpired() {
  window.location = '/insightweb/passwordExpired'
}

export function jumpToScheduleDemo(locale) {
  window.location.replace(scheduleADemo(locale))
}

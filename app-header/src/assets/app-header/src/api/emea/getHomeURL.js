export default function getHomeURL({ isLoggedIn, userInformation: user }) {
  let url = window.siteHrefCurrentBase

  if (isLoggedIn) {

    // If the landing page is overridden for the company, use that.
    if (user.webGroup && user.webGroup.companyUiOptions.landingpage) {
      let landingUrl = user.webGroup.companyUiOptions.landingpage
      url = landingUrl.charAt(0) === '/' ? `${window.siteHrefCurrentBase}${landingUrl}` : `${window.siteHrefCurrentBase}/${landingUrl}`

    // If the user's homepage is set to be the MyInsight homepage.
    } else if (user.permissions.enableMyInsightLogoLink) {
      url = `${window.siteHrefCurrentBase}/apps/myinsight/home.php`
    }
  }

  return url
}

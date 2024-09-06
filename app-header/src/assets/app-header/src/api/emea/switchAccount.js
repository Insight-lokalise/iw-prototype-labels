import { windowRedirect } from '../common/util'

export default function switchAccount({ id, accountNumber, webUserName }) {
  return Promise.resolve({
    redirectURL: `${window.siteHrefCurrentBase}/apps/account/index.php?a=nl&c=${encodeURIComponent(
      accountNumber
    )}&o=${encodeURIComponent(id)}&e=${encodeURIComponent(
      webUserName
    )}&savecart=yes&multiple_billing=yes&referer=${encodeURIComponent(window.location.pathname)}&acctswitch=yes`,
  }).then(windowRedirect)
}

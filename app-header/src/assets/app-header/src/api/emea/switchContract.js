import { windowRedirect } from '../common/util'

export default function switchContract({ id, accountNumber, contactId, username }) {
  const redirectURL = `${window.siteHrefCurrentBase}/apps/account/index.php?a=nl&c=${encodeURIComponent(
    accountNumber
  )}&o=${encodeURIComponent(contactId)}&e=${encodeURIComponent(
    username
  )}&savecart=yes&multiple_billing=yes&page=${encodeURIComponent(
    window.location.pathname + window.location.search
  )}&agrmntswitch=yes&salesagreementid=${encodeURIComponent(id)}`

  windowRedirect({ redirectURL })
}

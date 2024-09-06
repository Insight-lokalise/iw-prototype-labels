/**
 * NOTE: for now APAC sites have a different URL for creating a new account outside of insightweb.
 * This will be consolidated so all accounts are created in insightweb in a future release
 * Fusion change will update locale map to use Country Code since EMEA countries have too many languages
 */
const useSimplifiedCreateAccountLocaleMap = {
  CA: true,
  US: true,
  AU: false,
  AT: true,
  BE: true,
  CH: true,
  DE: true,
  ES: true,
  FR: true,
  GB: true,
  IT: true,
}
export default function getCreateAccountURL({ locale }) {
  const countryCode = locale.split('_')[1].toUpperCase()
  return useSimplifiedCreateAccountLocaleMap[countryCode] ? '/insightweb/endUser/createAccount' : `/${locale}/help/create-account.html`
}

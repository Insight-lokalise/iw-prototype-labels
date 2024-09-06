import { getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

export function linkTransformer(link) {
  const locale = getCookie('insight_locale')
  if(!link) return link
  if(isExternalOrWebApp(link)) return link
  let transformedLink = link
  if(!link.includes(locale)) {
    transformedLink = `/${locale}${link}`
  }
  return hasExtension(transformedLink)? transformedLink : `${transformedLink}.html`
}

const isExternalOrWebApp = (link) => link.includes('//') || link.includes('/insightweb')

// assume this is just AEM content link
const hasExtension = (link) => link.includes('.html')

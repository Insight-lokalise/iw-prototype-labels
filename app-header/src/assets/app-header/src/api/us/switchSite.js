import {getEnvironmentName} from '@insight/toolkit-utils/lib/helpers/getEnvironmentName'
import { COUNTRIES } from '../common/locales'
import { validateEmea } from '../common/util'

export default function switchSite(country, language, origin) {
  const { url, suffixes } = COUNTRIES[country]
  const suffix = suffixes[language]
  let env = getEnvironmentName(origin)

  if(env === 'prod') {
    window.location = `${url}/${suffix}`
  } else {

    if(env !== 'qae' && validateEmea(country)) {
      env = 'qae'
    } else if((env === 'qax' || env === 'qae') && !validateEmea(country)) {
      env = 'projectqa'
    }

    if(country === 'us') {
      window.location = `//${env}.insight.com/`
      return;
    } else if(country === 'in'){ // For India no site, So using direct url
      window.location = `//${ env=='qa'? 'projectqa' : env}.insight.com${url}/${suffix}`
      return;
    }

    window.location = `//${country === 'gb' ? 'uk' : country}-${env}.insight.com/${suffix}`
  }
}

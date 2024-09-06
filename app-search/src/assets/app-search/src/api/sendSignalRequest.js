import { sendSignal } from 'app-api-user-service'
import { getCurrentLocale } from '@insight/toolkit-utils'

const locale = getCurrentLocale('insight_locale')

// GenerateFacets Generates a key value mapping of the facet filters
const generateFacets = (facetFilters) => {
  if (!facetFilters) return []
  let facets = facetFilters
  // Check if range facet is array
  if (typeof facetFilters === 'string') facets = [facetFilters]
  // Create an array of key value facets
  let keyValueFacets = []
  // Map and return key value pair using current facet key
  facets.forEach((facet) => {
    const currentFacet = facet.split(':')
    const key = currentFacet[0]
    const facetValues = currentFacet[1]
    // Split facet values by pipe char
    const rangeFacetValue = facetValues.split('|')
    // Loop over array of facet values
    rangeFacetValue.forEach((value) => {
      keyValueFacets = [...keyValueFacets, `${key}/${value}`]
    })
  })

  return keyValueFacets
}

export const sendSignalRequest = (
  type,
  cdmUid,
  index,
  sessionId,
  fusionQueryId,
  signalMetaData,
  origParams,
  origFacetDisplays,
  searchSource,
  salesOrg,
  materialId
) => {
  const rangeFacetList = generateFacets(origParams.rangeFacet)
  const selectedFacetList = generateFacets(origParams.selectedFacet)

  const reqObject = {
    country: origParams.country,
    ctype: searchSource,
    materialId,
    fusionQueryId,
    signalMetaData,
    locale,
    query: origParams.q,
    resOffset: origParams.start,
    resPos: index,
    rows: origParams.rows,
    salesOrg,
    type,
    sessionId,
    userId: cdmUid,
    filterField: Object.keys(origFacetDisplays),
  }
  // Add filter node to request object if range or manufacturer facet list
  const filters = [...rangeFacetList, ...selectedFacetList]
  // Check for array of filters
  if (filters?.length) reqObject.filter = filters

  sendSignal([reqObject])
}

export default sendSignalRequest

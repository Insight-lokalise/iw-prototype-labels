import axios from "axios";

// GenerateFacets Generates a key value mapping of the facet filters
const generateFacets = (facetFilters) => {
  if (!facetFilters) return [];
  let facets = facetFilters;
  // Check if range facet is array
  if (typeof facetFilters === "string") facets = [facetFilters];
  // Create an array of key value facets
  let keyValueFacets = [];
  // Map and return key value pair using current facet key
  facets.forEach((facet) => {
    const currentFacet = facet.split(":");
    const key = currentFacet[0];
    const facetValues = currentFacet[1];
    // Split facet values by pipe char
    const rangeFacetValue = facetValues.split("|");
    // Loop over array of facet values
    rangeFacetValue.forEach((value) => {
      keyValueFacets = [...keyValueFacets, `${key}/${value}`];
    });
  });

  return keyValueFacets;
};

const formatSignalData = ({
  type,
  cdmUid,
  userId,
  index,
  signalMetaData,
  origFacetDisplays,
  searchSource,
  origParams,
  fusionQueryId,
  salesOrg,
  materialId,
  country
}) => {
  let rangeFacetList, selectedFacetList;

  if (signalMetaData) {
    const signalMetaDataJS = JSON.parse(signalMetaData);
    origParams = signalMetaDataJS.origParams;
    origFacetDisplays = signalMetaDataJS.origFacetDisplays;
    rangeFacetList = generateFacets(origParams.rangeFacet);
    selectedFacetList = generateFacets(origParams.selectedFacet);
    fusionQueryId = signalMetaDataJS.fusionQueryId;
  }

  const filterField = origFacetDisplays
    ? Object.keys(origFacetDisplays)
    : undefined;

  const reqObject = {
    country: origParams.country ? origParams.country:country ,
    ctype: searchSource,
    materialId,
    fusionQueryId,
    query: origParams.q,
    resOffset: origParams.start,
    resPos: index,
    rows: origParams.rows,
    salesOrg,
    type,
    userId: cdmUid || userId,
    filterField,
  };
  // Add filter node to request object if range or manufacturer facet list
  const filters = [...rangeFacetList, ...selectedFacetList];
  // Check for array of filters
  if (filters.length) reqObject.filter = filters;

  return reqObject;
};

const sendSignal = async (param) => {

  const signals = param
    .map((request) => {
      if (request?.fusionQueryId || request?.signalMetaData) {
        const lang = request.locale === 'en_CA' ? 'en_US' : request.locale
        const formattedData = formatSignalData(request);
        const tempSignalData = {
          country: request.country,
          ctype: request.ctype, // "typeahead", "search", "brand", "category", "compare"
          docId: request.materialId,
          filterField: request.filterField,
          filter: request.filter,
          fusionQueryId: request.fusionQueryId,
          lang,
          locale: request.locale,
          query: request.query,
          resOffset: request.resOffset
            ? parseInt(request.resOffset)
            : undefined,
          resPos: request.resPos ? parseInt(request.resPos) : undefined,
          rows: request.rows ? parseInt(request.rows) : undefined,
          salesOrg: request.salesOrg ? parseInt(request.salesOrg) : undefined,
          sku: request.materialId,
          type: request.type, // "click", "cart", "purchase", "quote"
          userId: request.userId,
          userSegment: "CES",
        };
        return { ...tempSignalData, ...formattedData };
      }
    })
    .filter(Boolean);
  if (signals.length > 0 && window.getPrivacySettings().functional) {
    return new Promise( (resolve, reject) => {
      axios({
        method: "post",
        url: `/api/product-search/signal`,
        data: signals,
        maxRedirects: 0,
        onUploadProgress: (progressObj) => {
          if(progressObj.loaded === progressObj.total) { // Promise will be resolved as soon as request has been fully sent.
            resolve(true);
          }
        }
      }).catch((error) => console.warn("Error sending signal: " + error));
    } )
  }
};

export default sendSignal;


const getProductsWithPrice = (placement, prices) => {
  const prodList = placement?.prodList;
  if (!prodList?.length || !prices) return prodList;
  return prodList.filter((product) => prices[product.materialId] && !prices[product.materialId].callForPrice)
}

const updateRecommendationsData = (placements, recommendationsPrices, recommendationsInfo) => {
  Object.keys(placements).forEach(key => {
    const placement = recommendationsInfo[key];
    recommendationsInfo[key] = { ...placement, prodList: getProductsWithPrice(placement, recommendationsPrices) }
  })
}

const getIpsRecommendations = async (
  SSE,
  payload,
  contract,
  {
    placements,
    onRecommendationsInfo,
    onPrices,
    onComplete,
    onError,
  }
) => {
  const validContract = contract || {}
  const source = new SSE("/gapi/product-management/getRecommendations-sse", {
    headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' },
    method: 'POST',
    payload: JSON.stringify({
      ...payload,
      "contractId": validContract.contractId || validContract.contractNumber,
      "contractType": validContract.contractName
    })
  });

  source.addEventListener('recommendationsInfo', function (e) {
    const payload = JSON.parse(e.data);
    const recommendationsInfo = {}
    Object.entries(placements).forEach(([key, value]) => {
      recommendationsInfo[key] = payload.find(item => item.placementId === value)
    })
    onRecommendationsInfo?.(recommendationsInfo)
  });

  source.addEventListener('prices', function (e) {
    const payload = e.data;
    if (payload?.length) {
      const prices = JSON.parse(payload);
      if (Object.keys(prices).length) {
        onPrices?.(prices)
      }
    }
  });

  return new Promise((resolve, reject) => {
    source.addEventListener('readystatechange', e => {
      if (e.readyState === 2) {
        onComplete?.(resolve)
      }
    })
    source.addEventListener('error', e => {
      onError?.(e)
      reject(e)
    });
  });
}

/**
 * This class is used to store the recommendations data and prices in ondemand process
 **/
class RecommendationsData {
  constructor(placements) {
    this.placements = placements
    this.originalRecommendations = {}
    this.recommendations = {}
    this.prices = {}
  }

  onRecommendationsInfo = recommendationsInfo => this.originalRecommendations = recommendationsInfo

  onPrices = prices => {
    const recommendationsInfo = { ...this.originalRecommendations }
    this.prices = { ...this.prices, ...prices }
    updateRecommendationsData(this.placements, this.prices, recommendationsInfo)
    this.recommendations = recommendationsInfo
  }

  onComplete = resolve => {
    resolve(this.recommendations)
  }

}

export const usePlacements = (
  {
    placements = {},
    productId,
    byPassError,
    contract,
    salesOrg,
    getSessionUser,
    getNonIpsRecommendations = async () => { },
    getRequestForRecommendationsApi,
    onRecommendationsInfo,
    runOnInit = true,
    useEffect,
    useState,
    SSE,
  }) => {
  const [originalRecommendations, setOriginalRecommendations] = useState({})
  const [recommendations, setRecommendations] = useState({})
  const [recommendationsPrices, setRecommendationsPrices] = useState({})
  const [recommendationsSSEComplete, setRecommendationsSSEComplete] = useState(true)
  const [recommendationsSSEError, setRecommendationsSSEError] = useState(false)

  const placementIds = Object.values(placements).join('|');

  useEffect(() => {
    const recommendationsInfo = { ...originalRecommendations }
    updateRecommendationsData(placements, recommendationsPrices, recommendationsInfo)
    setRecommendations(recommendationsInfo)
  }, [recommendationsPrices]);

  /**
   * This method is called when 'runOnInit' is set to true. It is used in the PDP,
   * which calls the '/getRecommendations-sse' endpoint on page load.
   **/
  const populateRecommendations = async (productId, byPassError, contract) => {
    setRecommendationsSSEComplete(false)
    setRecommendationsSSEError(false)
    try {
      const {
        userInformation: {
          salesOrg: userSalesOrg,
          isIpsUser: loginIpsUser,
        } = {},
        isLoggedIn: loggedin,
        isIpsLogo,
      } = await getSessionUser();
      if ((isIpsLogo || loginIpsUser) && !!contract) {
        // if it's logout/login ips and contract is been selected then call eventStream and get data}
        const nonLoggedInIpsUser = !loggedin && isIpsLogo
        const ipsUser = nonLoggedInIpsUser || loggedin && loginIpsUser
        const body = await getRequestForRecommendationsApi(placementIds, productId, ipsUser);
        return await getIpsRecommendations(SSE, body, contract, {
          placements,
          onRecommendationsInfo: recommendationsInfo => {
            onRecommendationsInfo?.(recommendationsInfo)
            setOriginalRecommendations(recommendationsInfo)
          },
          onPrices: prices => setRecommendationsPrices(prevData => ({ ...prevData, ...prices })),
          onComplete: resolve => {
            setRecommendationsSSEComplete(true)
            resolve(recommendations)
          },
          onError: () => setRecommendationsSSEError(true),
        })
      } else {
        const recommendationsInfo = await getNonIpsRecommendations(productId, false, salesOrg || userSalesOrg)
        setRecommendations(recommendationsInfo)
        return recommendationsInfo
      }
    } catch (err) {
      console.warn(`Failed to fetch placements`, err)
      setRecommendationsSSEError(true)
      return {}
    } finally {
      setRecommendationsSSEComplete(true)
    }
  }

  useEffect(() => {
    if (runOnInit) {
      populateRecommendations(productId, byPassError, contract)
    }
  }, [productId, byPassError, contract])

  const isIpsUser = async () => {
    if (!getSessionUser) return false;
    const {
      userInformation: {
        isIpsUser: loginIpsUser,
      } = {},
      isLoggedIn: loggedin,
      isIpsLogo,
    } = await getSessionUser()
    return !loggedin && isIpsLogo || loggedin && loginIpsUser
  }

  /**
   * This method is called when 'runOnInit' is set to false. It is utilized in the 'Add to Cart'
   * functionality in Search and Product Compare, which in turn calls the '/getRecommendations-sse'
   * endpoint on demand.
   **/
  const getRecommendationData = async (productId, contract, ipsUser, payload) => {
    setOriginalRecommendations({})
    setRecommendations({})
    setRecommendationsPrices({})
    setRecommendationsSSEComplete(false)
    setRecommendationsSSEError(false)
    try {
      let body = payload
      if (payload === undefined || payload === null) {
        let finalIpsUser = ipsUser;
        if (ipsUser === undefined || ipsUser === null) {
          finalIpsUser = await isIpsUser()
        }
        body = await getRequestForRecommendationsApi(placementIds, productId, finalIpsUser)
      }

      const recommendationsData = new RecommendationsData(placements)
      recommendationsData.onError = () => setRecommendationsSSEError(true)

      const recommendationInfo = await getIpsRecommendations(SSE, body, contract, recommendationsData)
      setRecommendationsSSEComplete(true)
      setOriginalRecommendations(recommendationInfo)
      setRecommendations(recommendationInfo)
      setRecommendationsPrices(recommendationsData.prices)
      return { recommendationInfo, priceInfo: recommendationsData.prices }
    } catch (err) {
      console.warn(`Failed to fetch placements`, err)
      return {}
    }
  }

  return { recommendations, recommendationsSSEError, recommendationsSSEComplete, recommendationsPrices, getRecommendationData }
}

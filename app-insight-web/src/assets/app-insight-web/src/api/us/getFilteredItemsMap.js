import getLoggedInFilterMap from './getLoggedInFilterMap'
import setCachedFilteredItemsMap from './setCachedFilteredItemsMap'

export default function getFilteredItemsMap({ sessionInfo }) {
  const { isLoggedIn, locale } = sessionInfo
  const filterMapPromise = () =>
    isLoggedIn
      ? getLoggedInFilterMap(locale).then(filterMap =>
        setCachedFilteredItemsMap(filterMap)
      )
      : setCachedFilteredItemsMap(Promise.resolve({}))

  return filterMapPromise().then(filteredItemMap => filteredItemMap)
}

import { getLoggedInFilterMap, setCachedFilteredItemsMap } from 'api'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { INSIGHT_LOCALE_COOKIE_NAME } from '../common/locales'

export default function getFilteredItemsMap({ aemMenuItems, headerInfo }) {
  const { isLoggedIn } = headerInfo
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)

  const filterMapPromise = () =>
    isLoggedIn
      ? getLoggedInFilterMap(locale).then(filterMap =>
          setCachedFilteredItemsMap(filterMap, headerInfo.userInformation.email)
        )
      : createLoggedOutFilterMap(aemMenuItems).then(filterMap => setCachedFilteredItemsMap(filterMap, 'loggedOut'))

  return filterMapPromise().then(filteredItemMap => filteredItemMap)
}

function createLoggedOutFilterMap(aemMenuItems) {
  const filterMap = {}

  function filterNode(node) {
    if (node.access && node.access.appearsWhen && node.access.appearsWhen.startsWith('logged-in')) {
      filterMap[node.id] = true
    } else if (node.nodes) {
      node.nodes.forEach(filterNode)
    }
  }

  aemMenuItems.mainNav.forEach(filterNode)
  filterNode(aemMenuItems.tools)
  filterNode(aemMenuItems.support)

  return Promise.resolve(filterMap)
}

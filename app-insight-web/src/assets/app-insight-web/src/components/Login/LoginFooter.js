import React, { useEffect, useState } from 'react'
import { getCachedAemMenuItems, getCachedFilteredItemsMap, getSessionInformation, getFilteredItemsMap, getFooterMenuItems } from 'api'

import LoginFooterLinks from './LoginFooterLinks'

export default function LoginFooter(){
  const [sessionInfo, setSessionInfo] = useState({})
  const [cachedAemMenuItems, setCachedAemMenuItems] = useState(null)
  const [cachedFilteredItemMap, setCachedFilteredItemMap] = useState(null)
  const [aemMenuItems, setAemMenuItems] = useState(cachedAemMenuItems || {})
  const [filteredItemMap, setFilteredItemMap] = useState(cachedFilteredItemMap)
  const [isLoading, setIsLoading] = useState(true)

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    getFooterData()
  }, [])

  const getFooterData = () => {
    getSessionInformation().then(sessionInfo =>
      Promise.all([
        sessionInfo,
        getCachedAemMenuItems(),
        getCachedFilteredItemsMap(sessionInfo.isLoggedIn)
      ])
    )
    .then(([sessionInfo, cachedAemMenuItems, cachedFilteredItemMap]) => {
      setIsLoading(false)
      setSessionInfo(sessionInfo)
      setCachedAemMenuItems(cachedAemMenuItems)
      setCachedFilteredItemMap(cachedFilteredItemMap)
    })
  }

  useEffect(() => {
    getFooterMenuItems().then(setAemMenuItems)
  }, [])

  useEffect(() => {
    if (aemMenuItems) {
      getFilteredItemsMap({ sessionInfo }).then(setFilteredItemMap)
    }
  }, [aemMenuItems])

  const shouldRender = !isLoading && Object.keys(aemMenuItems).length > 0 && filteredItemMap

  return shouldRender ? (
    <footer className="c-login-footer">
      <section className="o-grid o-grid--gutters o-grid--justify-center">
        <span className="o-grid__item  u-1/1 u-width-shrink@mobile-landscape  u-text-uppercase">&copy; {currentYear} Insight</span>
        <nav className="o-grid__item  u-1/1 u-width-shrink@mobile-landscape">
          { filteredItemMap[aemMenuItems.policy.id] ? null :
            <LoginFooterLinks policyLinks={aemMenuItems.policy.nodes} excludedLinks={filteredItemMap} />
          }
        </nav>
      </section>
    </footer>
  ) : null
}

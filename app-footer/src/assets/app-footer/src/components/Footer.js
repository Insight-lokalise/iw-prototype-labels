import React, { useEffect, useState } from 'react'
import { getFilteredItemsMap, getFooterMenuItems } from '../api'
import PropTypes from 'prop-types'
import { useDimensions } from "@insight/toolkit-react/lib/hooks"
import { isDesktop } from '@insight/toolkit-utils'

import FooterHelp from './FooterHelp'
import FooterTerms from './FooterTerms'
import FooterCompany from './FooterCompany'
import FooterPolicy from './FooterPolicy'

export default function Footer({ cachedAemMenuItems, sessionInfo, cachedFilteredItemMap }){
  const [{ entry: { width: divWidth } }, divRef] = useDimensions({ entry: {} })
  const [isMobile, setMobile] = useState(!isDesktop())
  const [aemMenuItems, setAemMenuItems] = useState((cachedAemMenuItems && cachedAemMenuItems.social) ? cachedAemMenuItems : {})
  const [filteredItemMap, setFilteredItemMap] = useState(cachedFilteredItemMap)

  useEffect(() => {
    getFooterMenuItems().then(setAemMenuItems)
  }, [])

  useEffect(() => {
    if (aemMenuItems) {
      getFilteredItemsMap({ sessionInfo }).then(setFilteredItemMap)
    }
  }, [aemMenuItems])

  useEffect(() => {
    setMobile(!isDesktop())
  }, [divWidth])

  const shouldRender = Object.keys(aemMenuItems).length > 0 && filteredItemMap

  return shouldRender ? (
    <div className="ds-v1 app-footer" ref={divRef}>
      <div className="c-footer">
        { filteredItemMap[aemMenuItems.help.id] ? null : <FooterHelp helpLinks={aemMenuItems.help.nodes} excludedLinks={filteredItemMap} /> }
        { filteredItemMap[aemMenuItems.terms.id]
          ? (
            null
          ) : (
            <FooterTerms
              isMobile={isMobile}
              termsLinks={aemMenuItems.terms.nodes}
              excludedLinks={filteredItemMap}
              newsletterLinks={aemMenuItems.newsletter || {}}
              socialLinks={aemMenuItems.social && aemMenuItems.social.nodes || []}
            />
          )
        }
        <div className="c-footer-padding-large">
          <div className='o-grid o-grid--gutters-large o-grid--justify-between'>
            { (filteredItemMap[aemMenuItems.company.id] || isMobile) ? null :
              <div className='o-grid__item  u-1/1 u-1/2@desktop'>
                <FooterCompany companyLinks={aemMenuItems.company.nodes} />
              </div>
            }
            { filteredItemMap[aemMenuItems.policy.id] ? null :
              <div className='o-grid__item  u-1/1 u-1/2@desktop'>
                <FooterPolicy policyLinks={aemMenuItems.policy.nodes} excludedLinks={filteredItemMap} />
              </div>
            }
            { (filteredItemMap[aemMenuItems.company.id] || !isMobile) ? null :
              <div className='o-grid__item  u-1/1 u-1/2@desktop'>
                <FooterCompany companyLinks={aemMenuItems.company.nodes} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  ) : null
}

Footer.propTypes = {
  cachedAemMenuItems: PropTypes.shape({}),
  cachedFilteredItemMap: PropTypes.shape({}),
  sessionInfo: PropTypes.shape({
    locale: PropTypes.string.isRequired,
  }).isRequired
}

Footer.defaultProps = {
  cachedAemMenuItems: null,
  cachedFilteredItemMap: null,
}

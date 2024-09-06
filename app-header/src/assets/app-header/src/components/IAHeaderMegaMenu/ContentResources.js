import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'

export default function ContentResources({ isMobile, submenuList }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  const firstTier = submenuList[0]
  const secondTier = submenuList ? submenuList.slice(1) : []

  return (
    <div>
      <div className="c-header-mega-menu__section  c-header-mega-menu__section--highlight  u-show@desktop">
        <div className="o-wrapper">
          <div className="o-grid  o-grid--bottom  o-grid--gutters">
            <div className="o-grid__item">
              <Submenu
                columns={3}
                delay={0}
                hideViewAll
                id={firstTier.id}
                isOpen={activeSubMenu === firstTier.id}
                onClose={() => setActiveSubMenu(null)}
                onOpen={() => setActiveSubMenu(firstTier.id)}
                tagline={firstTier.description}
                title={firstTier.title}
                {...(firstTier.href ? { href: firstTier.href } : {})}
              >
                <SubmenuItems isMobile={isMobile} items={firstTier.nodes} showMeta />
              </Submenu>
            </div>
          </div>
        </div>
      </div>

      {secondTier && (
        <div className="c-header-mega-menu__section">
          <div className="o-wrapper">
            <div className="o-grid  o-grid--gutters">
              {secondTier.map((submenuNode, index) => (
                <div key={submenuNode.id} className="o-grid__item  u-1/1  u-1/4@desktop">
                  <Submenu
                    delay={2 + index}
                    hideViewAll
                    id={submenuNode.id}
                    isOpen={activeSubMenu === submenuNode.id}
                    onClose={() => setActiveSubMenu(null)}
                    onOpen={() => setActiveSubMenu(submenuNode.id)}
                    tagline={submenuNode.description}
                    title={submenuNode.title}
                    {...(submenuNode.href ? { href: submenuNode.href } : {})}
                  >
                    <SubmenuItems isMobile={isMobile} items={submenuNode.nodes} />
                  </Submenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ContentResources.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  submenuList: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      description: PropTypes.string,
      href: PropTypes.string,
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          assetName: PropTypes.string,
          date: PropTypes.string,
          href: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          image: PropTypes.string,
          title: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}

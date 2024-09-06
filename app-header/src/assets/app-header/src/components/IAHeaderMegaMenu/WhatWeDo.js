import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '@insight/toolkit-react/lib/Button/Button'

import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'
import FadeIn from './FadeIn'

export default function WhatWeDo({ isMobile, submenuList }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  // In IPS scenario we will receive more submenu items than standard submenu items (7)

  const lengthOfSubMenuItems = submenuList ? submenuList.length : 0

  const firstTier = submenuList ? submenuList.slice(0, 4) : []
  const secondTier = submenuList ? submenuList[4] : {}
  let thirdTier;
  let viewAll;
  if(lengthOfSubMenuItems > 7) {
    thirdTier = submenuList ? submenuList.slice(5, lengthOfSubMenuItems-1) : []
    viewAll = submenuList ? submenuList[lengthOfSubMenuItems-1] : {}
    // last Item in array is expected as View all link
  } else {
    thirdTier = submenuList ? submenuList[5] : {}
    viewAll = submenuList ? submenuList[6] : {}
  }

  return (
    <div>
      <div className="c-header-mega-menu__section">
        <div className="o-wrapper">
          <div className="o-grid  o-grid--gutters">
            {firstTier.map((submenuNode, index) => (
              <div key={submenuNode.id} className="o-grid__item  u-1/1  u-1/4@desktop">
                <Submenu
                  color={submenuNode.backgroundColor}
                  delay={index}
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
      {secondTier && (
        <div className="c-header-mega-menu__section  c-header-mega-menu__section--highlight">
          <div className="o-wrapper">
            <div className="o-grid  o-grid--justify-between  o-grid--bottom">
              <div className="o-grid__item  u-1/1  u-width-shrink@desktop">
                <Submenu
                  columns={3}
                  delay={4}
                  hideViewAll
                  id={secondTier.id}
                  isOpen={activeSubMenu === secondTier.id}
                  onClose={() => setActiveSubMenu(null)}
                  onOpen={() => setActiveSubMenu(secondTier.id)}
                  tagline={secondTier.description}
                  title={secondTier.title}
                  {...(secondTier.href ? { href: secondTier.href } : {})}
                >
                  <SubmenuItems isMobile={isMobile} items={secondTier.nodes} />
                </Submenu>
              </div>
            </div>
          </div>
        </div>
      )}
      {thirdTier && (
        <div className="c-header-mega-menu__section">
          <div className="o-wrapper">
            {Array.isArray(thirdTier) ? (
              <div className="o-grid  o-grid--justify-between">
                { thirdTier.map((submenuNode, index) => (
                  <div key={submenuNode.id} className="o-grid__item  u-1/1  u-1/4@desktop">
                    <Submenu
                      color={submenuNode.backgroundColor}
                      delay={index}
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
                {renderViewAll(viewAll)}
              </div>
            ) : (
              <div className="o-grid  o-grid--justify-between o-grid--bottom">
                <div className="o-grid__item  u-1/1  u-width-shrink@desktop">
                  <Submenu
                    columns={3}
                    delay={5}
                    hideViewAll
                    id={thirdTier.id}
                    isOpen={activeSubMenu === thirdTier.id}
                    onClose={() => setActiveSubMenu(null)}
                    onOpen={() => setActiveSubMenu(thirdTier.id)}
                    tagline={thirdTier.description}
                    title={thirdTier.title}
                    {...(thirdTier.href ? { href: thirdTier.href } : {})}
                  >
                    <SubmenuItems isMobile={isMobile} items={thirdTier.nodes} />
                  </Submenu>
                </div>
                {renderViewAll(viewAll)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function renderViewAll(viewAll) {
  return viewAll && (
    <div className="o-grid__item  u-1/1  u-width-shrink@desktop">
      <FadeIn delay={5}>
        <Button
          className="c-header-nav__link  u-margin-top u-margin-bot-small  u-show@desktop"
          color="primary"
          href={viewAll.href}
          size="small"
        >
          {viewAll.title}
        </Button>
        <Button
          className="c-header-nav__link  c-header-nav__link--view-all  u-hide@desktop"
          color="subtle"
          href={viewAll.href}
        >
          {viewAll.title}
        </Button>
      </FadeIn>
    </div>
  )
}

WhatWeDo.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  submenuList: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      description: PropTypes.string,
      href: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        })
      ),
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
}

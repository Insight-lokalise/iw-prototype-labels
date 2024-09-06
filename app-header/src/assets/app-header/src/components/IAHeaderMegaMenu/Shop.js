import React, { Fragment, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function Shop({ isMobile, submenuList }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  const lengthOfSubmenus = submenuList.length
  const {
    headerInfo: { locale },
  } = useContext(IAHeaderContext)
  const localeArr = locale.split('_')

  const firstTier = submenuList ? submenuList.slice(0, 2) : []
  let secondTier = []
  let thirdTier = []
  let fourthTier = []
  if (localeArr[1] === 'CA') {
    secondTier = submenuList ? submenuList.slice(2, 3) : []
    thirdTier = submenuList ? submenuList.slice(3, 4) : []
    fourthTier = submenuList ? submenuList.slice(4, 5) : []
  } else if (lengthOfSubmenus > 5) {
    secondTier = submenuList ? submenuList.slice(2, 5) : []
    thirdTier = submenuList ? submenuList.slice(5, 6) : []
    fourthTier = submenuList ? submenuList.slice(6, 7) : []
  } else {
    // In IPS scenario Shop menu will have less number of sub menus
    secondTier = submenuList ? submenuList.slice(2, 3) : []
    thirdTier = submenuList ? submenuList.slice(3, 4) : []
    fourthTier = submenuList ? submenuList.slice(4) : []
  }

  return (
    <Fragment>
      <div className="o-wrapper">
        <div className="o-grid  o-grid--gutters">
          <div className="o-grid__item  u-1/1  u-3/5@desktop">
            <div className="c-header-mega-menu__section  c-header-mega-menu__section--flush">
              <div className="o-grid  o-grid--gutters">
                {firstTier.map((submenuNode, index) => (
                  <div
                    key={submenuNode.id}
                    className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot@desktop"
                  >
                    <Submenu
                      delay={index}
                      columns={submenuNode.columns}
                      id={submenuNode.id}
                      isOpen={activeSubMenu === submenuNode.id}
                      onClose={() => setActiveSubMenu(null)}
                      onOpen={() => setActiveSubMenu(submenuNode.id)}
                      tagline={submenuNode.description}
                      title={submenuNode.title}
                      hideViewAll
                      {...(submenuNode.href ? { href: submenuNode.href } : {})}
                    >
                      <SubmenuItems
                        isMobile={isMobile}
                        items={submenuNode.nodes}
                      />
                    </Submenu>
                  </div>
                ))}
                {secondTier.map((submenuNode, index) => (
                  <div
                    key={submenuNode.id}
                    className="o-grid__item  u-1/1  u-1/3@desktop"
                  >
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
                      <SubmenuItems
                        isMobile={isMobile}
                        items={submenuNode.nodes}
                      />
                    </Submenu>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* TODO: add support to Header.MegaMenu.Menu.Button for icon */}
          <div className="o-grid__item  u-1/1  u-2/5@desktop  u-show@desktop">
            <div className="c-header-mega-menu__section  c-header-mega-menu__section--highlight  c-header-mega-menu__section--extend  c-header-mega-menu__section--extend-right">
              <div className="u-margin-bot-small@desktop">
                {thirdTier.map((submenuNode) => (
                  <Submenu
                    delay={2}
                    hideViewAll
                    id={submenuNode.id}
                    isOpen={activeSubMenu === submenuNode.id}
                    key={submenuNode.id}
                    onClose={() => setActiveSubMenu(null)}
                    onOpen={() => setActiveSubMenu(submenuNode.id)}
                    tagline={submenuNode.description}
                    title={submenuNode.title}
                    {...(submenuNode.href ? { href: submenuNode.href } : {})}
                  >
                    <SubmenuItems
                      isMobile={isMobile}
                      items={submenuNode.nodes}
                    />
                  </Submenu>
                ))}
              </div>
              <div>
                {fourthTier.map((submenuNode) => (
                  <Submenu
                    delay={2}
                    hideViewAll
                    id={submenuNode.id}
                    isOpen={activeSubMenu === submenuNode.id}
                    key={submenuNode.id}
                    onClose={() => setActiveSubMenu(null)}
                    onOpen={() => setActiveSubMenu(submenuNode.id)}
                    tagline={submenuNode.description}
                    title={submenuNode.title}
                    {...(submenuNode.href ? { href: submenuNode.href } : {})}
                  >
                    <SubmenuItems
                      isMobile={isMobile}
                      items={submenuNode.nodes}
                    />
                  </Submenu>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

Shop.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  submenuList: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string,
          href: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          icon: PropTypes.string,
          title: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}

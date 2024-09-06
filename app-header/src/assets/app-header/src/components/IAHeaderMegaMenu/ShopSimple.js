import React, { Fragment, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function ShopSimple({ isMobile, submenuList, showLoggedOutMenu, isLoggedIn, isCES }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  const lengthOfSubmenus = submenuList.length
  const {
    headerInfo: { locale },
  } = useContext(IAHeaderContext);
  const localeArr = locale.split('_'); 
  let shopSections = []
  let highlightSections = []
  if(localeArr[1] === 'CA') {
    highlightSections = [submenuList[2]]
    shopSections = [submenuList[5], submenuList[6], submenuList[1]]
  } else if(lengthOfSubmenus > 10) {
    shopSections = [submenuList[7], submenuList[8], submenuList[1]]
    highlightSections = showLoggedOutMenu ? [submenuList[9], submenuList[10], submenuList[4]] : submenuList.slice(9)
  }

  
  return (
    <Fragment>
      <div className="o-wrapper">
        <div className="o-grid  o-grid--gutters">
          {shopSections.map((submenuNode, index) => (
            <div key={index} className="o-grid__item  u-1/1  u-1/4@desktop">
              <div className="c-header-mega-menu__section  c-header-mega-menu__section--flush">
                <Submenu
                  delay={index}
                  id={submenuNode.id}
                  isOpen={activeSubMenu === submenuNode.id}
                  onClose={() => setActiveSubMenu(null)}
                  onOpen={() => setActiveSubMenu(submenuNode.id)}
                  tagline={submenuNode.description}
                  title={submenuNode.title}
                  hideViewAll
                  {...(submenuNode.href ? { href: submenuNode.href } : {})}
                >
                  <SubmenuItems isMobile={isMobile} items={submenuNode.nodes} />
                </Submenu>
              </div>
            </div>
          ))}
          <div className="o-grid__item  u-1/1  u-1/4@desktop">
            <div className="c-header-mega-menu__section  c-header-mega-menu__section--highlight  c-header-mega-menu__section--extend  c-header-mega-menu__section--extend-right">
              {highlightSections.map((submenuNode, index) => (
                <div key={index} className="u-margin-bot@desktop">
                  <Submenu
                    delay={3+index}
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
                    <SubmenuItems isMobile={isMobile} items={submenuNode.nodes} />
                  </Submenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

ShopSimple.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  showLoggedOutMenu: PropTypes.bool,
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
  isCES: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
}

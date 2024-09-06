import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'
import SocialLinks from './SocialLinks'

export default function ConnectWithUs({ isMobile, submenuList }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  const firstTier = submenuList ? submenuList[0] : {}
  const secondTier = submenuList ? submenuList.slice(1, submenuList.length - 1) : []
  const socialNode = submenuList ? submenuList[submenuList.length - 1] : {}

  return (
    <Fragment>
      <div className="o-wrapper">
        <div className="o-grid  o-grid--gutters  o-grid--reverse">
          <div className="o-grid__item  u-1/1  u-3/5@desktop">
            <div className="c-header-mega-menu__section  c-header-mega-menu__section--flush">
              <div className="o-grid  o-grid--gutters  o-grid--full-height">
                {secondTier.map((submenuNode, index) => (
                  <div key={submenuNode.id} className="o-grid__item  u-1/1  u-1/4@desktop">
                    <Submenu
                      delay={1 + index}
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
                <SocialLinks node={socialNode} delay={5} />
              </div>
            </div>
          </div>
          <div className="o-grid__item  u-1/1  u-2/5@desktop">
            <div className="c-header-mega-menu__section  c-header-mega-menu__section--highlight  c-header-mega-menu__section--extend  c-header-mega-menu__section--extend-left">
              <Submenu
                delay={0}
                hideViewAll
                id={firstTier.id}
                isOpen={activeSubMenu === firstTier.title}
                onClose={() => setActiveSubMenu(null)}
                onOpen={() => setActiveSubMenu(firstTier.title)}
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
    </Fragment>
  )
}

ConnectWithUs.propTypes = {
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

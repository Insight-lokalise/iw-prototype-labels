import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '@insight/toolkit-react/lib/Button/Button'

import FadeIn from './FadeIn'
import Submenu from './Submenu'
import SubmenuItems from './SubmenuItems'

export default function ClientStories({ isMobile, submenuList }) {
  const [isActive, setIsActive] = useState(false)

  const viewAll = submenuList[0].nodes.slice(submenuList[0].nodes.length - 1)[0] || {}

  return (
    <div className="c-header-mega-menu__section">
      <div className="o-wrapper">
        <div className="o-grid  o-grid--justify-between  o-grid--bottom">
          <div className="o-grid__item  u-1/1  u-width-shrink@desktop">
            {submenuList.map(submenuNode => (
              <Submenu
                key={submenuNode.id}
                columns={3}
                delay={0}
                hideViewAll
                id={submenuNode.id}
                isOpen={isActive}
                onClose={() => setIsActive(false)}
                onOpen={() => setIsActive(true)}
                tagline={submenuNode.description}
                title={submenuNode.title}
                {...(submenuNode.href ? { href: submenuNode.href } : {})}
              >
                <SubmenuItems isMobile={isMobile} items={submenuNode.nodes} />
              </Submenu>
            ))}
          </div>
          <div className="o-grid__item  u-1/1">
            <FadeIn delay={1}>
              <Button className="u-show@desktop" color="primary" href={viewAll.href} size="small">
                {viewAll.title}
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

ClientStories.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  submenuList: PropTypes.arrayOf(
    PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          image: PropTypes.string,
          title: PropTypes.string.isRequired,
        })
      ).isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
}

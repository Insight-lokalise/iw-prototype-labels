import React from 'react'
import PropTypes from 'prop-types'

import Header from '@insight/toolkit-react/lib/Header/Header'

import useFilteredItemMap from '../../hooks/useFilteredItemMap'
import FadeIn from './FadeIn'

export default function Submenu(props) {
  const { children, color, columns, delay, hideViewAll, href, id, isOpen, onClose, onOpen, tagline, title } = props

  const filteredItemMap = useFilteredItemMap()

  return filteredItemMap[id] ? null : (
    <FadeIn delay={delay}>
      {title &&
        <Header.MegaMenu.Menu.Heading color={color} href={href} onClick={onOpen}>
          {title}
        </Header.MegaMenu.Menu.Heading>
      }
      {tagline && <Header.MegaMenu.Menu.Tagline>{tagline}</Header.MegaMenu.Menu.Tagline>}
      <Header.MegaMenu.Submenu
        columns={columns}
        hideViewAll={hideViewAll}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        {children}
      </Header.MegaMenu.Submenu>
    </FadeIn>
  )
}

Submenu.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  columns: PropTypes.number,
  delay: PropTypes.number.isRequired,
  hideViewAll: PropTypes.bool,
  href: PropTypes.string,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  tagline: PropTypes.string,
  title: PropTypes.string.isRequired,
}

Submenu.defaultProps = {
  color: '',
  columns: 1,
  hideViewAll: false,
  href: '',
  tagline: '',
}

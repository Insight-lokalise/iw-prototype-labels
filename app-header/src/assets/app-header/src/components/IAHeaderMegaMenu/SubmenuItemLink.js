import React from 'react'
import PropTypes from 'prop-types'

import Header from '@insight/toolkit-react/lib/Header/Header'
import { t } from 'api'

export default function SubmenuItemLink(props) {
  const { id, href, targetBlank, title } = props
  return (
    <Header.MegaMenu.Menu.Item key={id} href={href} targetBlank={targetBlank}>
      {t(title)}
    </Header.MegaMenu.Menu.Item>
  )
}

SubmenuItemLink.propTypes = {
  id: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  targetBlank: PropTypes.bool,
  title: PropTypes.string.isRequired,
}

SubmenuItemLink.defaultProps = {
  targetBlank: false,
}

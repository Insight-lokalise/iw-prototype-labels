import React from 'react'
import PropTypes from 'prop-types'

import DashletHeader from './DashletHeader'

// Attaches a header to dashlet content
export default function Dashlet(props) {
  return (
    <section>
      <DashletHeader
        headerLink={props.headerLink}
        headerText={props.headerText}
        title={props.title}
        toggleThisDashlet={props.toggleThisDashlet}
      />
      {props.children}
    </section>
  )
}

Dashlet.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  headerLink: PropTypes.shape({
    href: PropTypes.string,
    linkFunction: PropTypes.func,
    text: PropTypes.string.isRequired,
  }),
  headerText: PropTypes.string,
  title: PropTypes.string.isRequired,
  toggleThisDashlet: PropTypes.func,
}

Dashlet.defaultProps = {
  headerLink: undefined,
  headerText: undefined,
  toggleThisDashlet: undefined,
}

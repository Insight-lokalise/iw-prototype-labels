import React from 'react'
import PropTypes from "prop-types";

import Button from "@insight/toolkit-react/lib/Button/Button"

export default function FooterPolicy({ excludedLinks, policyLinks }) {
  return(
    <ul className='o-list-inline  c-login-footer__list'>
      {policyLinks.map((policy, index) => (
          excludedLinks[policy.id] ? null : (<li className='c-login-footer__list-item' key={index}>
          <Button className={policy.name} color="subtle" href={policy.type !== 'none' ? policy.href : '#'} size='small'>{policy.title}</Button>
        </li>)
      ))}
    </ul>
  )
}

FooterPolicy.propTypes = {
  policyLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  excludedLinks: PropTypes.shape({})
}

FooterPolicy.defaultProps = {
  excludedLinks: {},
  policyLinks: []
}

import React, { Fragment } from 'react'
import PropTypes from "prop-types";

import Button from "@insight/toolkit-react/lib/Button/Button";

export default function FooterPolicy({ excludedLinks, policyLinks }) {
  return(
    <Fragment>
      <ul className='o-list-inline  c-footer__inline-list'>
        {policyLinks.map((policy, index) => (
            excludedLinks[policy.id] ? null : (<li className="c-footer__inline-list-item" key={index}>
            <Button className={`${policy.name}`} color="tertiary-link" href={policy.type !== 'none' ? policy.href : '#'} size='small'>{policy.title}</Button>
          </li>)
        ))}
      </ul>
    </Fragment>
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

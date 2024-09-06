import React, { Fragment } from 'react'
import PropTypes from "prop-types";

export default function FooterCompany({ companyLinks }) {
  const companyInfo = companyLinks[0]
  return(
    <Fragment>
      <p className='c-footer__small-print'>{companyInfo.title}</p>
      <small className='c-footer__smaller-print'>{companyInfo.description}</small>
    </Fragment>
  )
}

FooterCompany.propTypes = {
  companyLinks: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      title: PropTypes.string,
    })
  ).isRequired
}


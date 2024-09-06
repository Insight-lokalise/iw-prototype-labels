import React from 'react'
import PropTypes from "prop-types";

import MobileNodeSection from './MobileNodeSection'
import NodeSection from './NodeSection'
import Social from './Social'

export default function FooterTerms({ isMobile, excludedLinks, newsletterLinks, socialLinks, termsLinks }) {
  const columns = termsLinks.length + 1
  return (
    <div className='o-grid'>
      {newsletterLinks ?
        <NodeSection
          term={newsletterLinks}
          index={9}
          isMobile={isMobile}
          excludedLinks={excludedLinks}
          columns={isMobile ? 1 : columns}
        />
        : null
      }
      {termsLinks.map((term, index) => (
        isMobile ? (
          <MobileNodeSection
            term={term}
            index={index}
            excludedLinks={excludedLinks}
            columns={columns}
          />
        ) : (
          <NodeSection
            term={term}
            index={index}
            excludedLinks={excludedLinks}
            columns={columns}
          />
        )
      ))}
      <div className={`o-grid__item  u-1/1`}>
        {socialLinks ? <Social nodes={socialLinks} /> : null}
      </div>
    </div>
  )
}

FooterTerms.propTypes = {
  isMobile: PropTypes.bool,
  newsletterLinks: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  termsLinks: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  excludedLinks: PropTypes.shape({})
}

FooterTerms.defaultProps = {
  isMobile: false,
  excludedLinks: {},
}

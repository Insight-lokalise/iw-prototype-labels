import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const countryFlagMap = {
  AT: 'austria',
  AU: 'australia',
  BE: 'belgium',
  CA: 'canada',
  CH: 'switzerland',
  CN: 'china',
  DE: 'germany',
  DK: 'denmark',
  ES: 'spain',
  FI: 'finland',
  FR: 'france',
  HK: 'hongkong',
  IE: 'ireland',
  IT: 'italy',
  NL: 'netherlands',
  NO: 'norway',
  NZ: 'newzealand',
  SE: 'sweden',
  SG: 'singapore',
  GB: 'unitedkingdom',
  US: 'unitedstates',
}

export default function IWFlagIcon(props) {
  return <span className={cn(`flag-${countryFlagMap[props.countryCode.toUpperCase()]}`, props.className)} />
}

IWFlagIcon.propTypes = {
  countryCode: PropTypes.string.isRequired,
  className: PropTypes.string,
}

IWFlagIcon.defaultProps = {
  className: '',
}

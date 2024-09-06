import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getPhoneNumber, t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'
import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'

export default function PhoneNumber(props) {
  const isFiltered = useFilteredItemStatus()
  const { headerInfo = {} } = useContext(IAHeaderContext)
  const { customContactNumber, isPhoneNumberEnabled, locale } = headerInfo

  const displayPhoneNumber = customContactNumber || getPhoneNumber(locale)

  const Wrapper = props.wrapper

  const splitTel = (num) => {
    let tel;
    let prevDigit
    num.split('').forEach((digit, i) => {
      if (i === 0) tel = digit;
      else if (digit === '.' || digit === ')' || prevDigit === '(' || prevDigit === '+') tel += digit;
      else tel += ` ${digit}`;
      prevDigit = digit
    });
    return displayPhoneNumber === '1.800.INSIGHT'
      ? '1. 8 0 0. 4 6 7. 4 4 4 8' : tel;
  }

  return !isFiltered && isPhoneNumberEnabled ? (
    <Wrapper
      aria-label={`${t('Telephone number is ')}${splitTel(displayPhoneNumber)}`}
      href={`tel:${displayPhoneNumber}`}
    >
      {displayPhoneNumber}
    </Wrapper>
  ) : null;
}

PhoneNumber.propTypes = {
  wrapper: PropTypes.func,
}

PhoneNumber.defaultProps = {
  wrapper: Header.Top.Item,
}

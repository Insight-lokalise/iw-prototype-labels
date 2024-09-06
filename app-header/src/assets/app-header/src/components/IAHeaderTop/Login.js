import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getLoginURL } from 'api'
import { t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function Login({ wrapper }) {
  const {
    headerInfo: { isLoggedIn },
  } = useContext(IAHeaderContext)

  const Wrapper = wrapper

  return !isLoggedIn && <Wrapper href={getLoginURL()}>{t('Login')}</Wrapper>
}

Login.propTypes = {
  wrapper: PropTypes.func,
}

Login.defaultProps = {
  wrapper: Header.Top.Item,
}

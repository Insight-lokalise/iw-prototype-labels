import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getCreateAccountURL, t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function CreateAccount({ wrapper }) {
  const {
    headerInfo: { isCreateAccountEnabled, isLoggedIn, locale },
  } = useContext(IAHeaderContext)

  const showLink = isCreateAccountEnabled && !isLoggedIn

  const Wrapper = wrapper

  return showLink && <Wrapper href={getCreateAccountURL({ locale })}>{t('Create an account')}</Wrapper>
}

CreateAccount.propTypes = {
  wrapper: PropTypes.func,
}

CreateAccount.defaultProps = {
  wrapper: Header.Top.Item,
}

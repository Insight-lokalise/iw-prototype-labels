import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

import { t } from 'api'

import { ModalContext, MODALS } from '../Modal'
import IAHeaderContext from '../../context/IAHeaderContext'
import usePermissions from '../../hooks/usePermissions'
import { MASTHEAD_ICON_TITLES_INSIGHT_NEWS } from '../../api/common/constants'

export default function Notifications({ isMobile, wrapper }) {
  const {
    headerInfo: { isLoggedIn },
  } = useContext(IAHeaderContext)
  const { enableNotifications } = usePermissions()
  const { setActiveModal } = useContext(ModalContext)
  const title = MASTHEAD_ICON_TITLES_INSIGHT_NEWS

  const Wrapper = wrapper

  return isLoggedIn && enableNotifications ? (
    <Wrapper
      onClick={() => {
        setActiveModal(MODALS.NEWS_MODAL)
      }}
      aria-label={t('Notifications')}
    >
      {isMobile ? t('Notifications') : <Icon icon="notifications" title={t(title)}/>}
    </Wrapper>
  ) : null
}

Notifications.propTypes = {
  isMobile: PropTypes.bool,
  wrapper: PropTypes.func,
}

Notifications.defaultProps = {
  isMobile: false,
  wrapper: Header.Top.Item,
}

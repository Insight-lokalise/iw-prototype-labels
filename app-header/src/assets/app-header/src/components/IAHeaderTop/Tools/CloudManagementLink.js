import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'
import { displayLoadingModal, getHasCloudManagement, redirectToCloudManagement, t } from 'api'

import { ModalContext, MODALS } from '../../Modal'

export default function CloudManagementLink(props) {
  const { setActiveModal } = useContext(ModalContext)
  const [hasCloudManagement, setHasCloudManagement] = useState(false)

  useEffect(() => {
    getHasCloudManagement().then(result => setHasCloudManagement(result))
  }, [])

  function goToCloudManagement() {
    displayLoadingModal(true)
    redirectToCloudManagement().catch(error => {
      displayLoadingModal(false)
      if (error.response.status === 404) {
        setActiveModal(MODALS.ALERT_MODAL, {
          title: t('Login Error'),
          message: t(
            'We could not log you in to the Cloud Administration Portal. Please contact your account manager if this error persists.'
          ),
        })
      } else {
        setActiveModal(MODALS.ALERT_MODAL, {
          title: t('Service Error'),
          message: t('The service is not available at the moment. Please try later.'),
        })
      }
    })
  }

  return hasCloudManagement ? (
    <Header.Top.Dropdown.Item
      className={props.className}
      onClick={goToCloudManagement}
      {...(props.openNewTab ? { target: '_blank' } : {})}
    >
      {t('Manage Cloud Portal')}
    </Header.Top.Dropdown.Item>
  ) : null
}

CloudManagementLink.propTypes = {
  className: PropTypes.string.isRequired,
  openNewTab: PropTypes.bool,
}

CloudManagementLink.defaultProps = {
  openNewTab: false,
}

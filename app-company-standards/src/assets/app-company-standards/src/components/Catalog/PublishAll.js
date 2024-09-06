import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ModalContext, MODALS } from '../Modals'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { UniversalMessageContext } from "../UniversalMessages"

export default function PublishAll({ wId, publishAllHandler }) {

  const { setActiveModal } = useContext(ModalContext)
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function startPublishAll() {
    setActiveModal(MODALS.PUBLISH_ALL, { onConfirm: publishAllHandler, wId, messenger: setActiveMessage })
  }

  return (
    <Button
      className="u-padding-tiny i-padding-bot-none i-padding-top-none"
      color="link"
      onClick={startPublishAll}
    >
      <span className="u-margin-right-tiny">{t('Publish all')}</span>
      <Icon icon="share" />
    </Button>
  )
}

PublishAll.propTypes = {
  wId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  publishAllHandler: PropTypes.func.isRequired,
}

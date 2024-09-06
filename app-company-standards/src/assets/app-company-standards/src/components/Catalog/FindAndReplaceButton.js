import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { ModalContext, MODALS } from '../Modals'
import { LanguageContext } from '../../lib'

export default function FindAndReplaceButton({ webGroupId }) {
  const { language } = useContext(LanguageContext)
  const { setActiveModal } = useContext(ModalContext)

  return (
    <Button
      className="u-padding-tiny u-padding-bot-none"
      color="link"
      onClick={() => {
        setActiveModal(MODALS.FIND_AND_REPLACE, { lang: language, webGroupId })
      }}
    >
      <span className="u-margin-right-tiny">{t('Find and replace')}</span>
      <Icon icon="sync" />
    </Button>
  )
}

FindAndReplaceButton.propTypes = {
  webGroupId: PropTypes.number.isRequired,
}

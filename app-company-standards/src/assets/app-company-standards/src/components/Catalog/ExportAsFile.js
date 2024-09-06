import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { LanguageContext } from '../../lib'

export default function ExportAsFile(props) {
  const { language } = useContext(LanguageContext)

  return (
    <Button
      className="u-padding-tiny i-padding-bot-none"
      color="link"
      download={props.exportFileName[language]}
      href={props.exportFileUrl}
    >
      <span className="u-margin-right-tiny">{t('Export as a file')}</span>
      <Icon icon="download" />
    </Button>
  )
}

ExportAsFile.propTypes = {
  exportFileUrl: PropTypes.string.isRequired,
  exportFileName: PropTypes.objectOf(PropTypes.string).isRequired,
}

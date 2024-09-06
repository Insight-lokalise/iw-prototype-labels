import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function DuplicateButton(props) {
  function handleClick() {
    props.onSubmit()
  }

  return (
    <Button color="primary" isDisabled={props.isDisabled} onClick={handleClick}>
      {t('Duplicate')}
    </Button>
  )
}

DuplicateButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils';

export default function CharacterCounter ({currentLength, maxLength}) {
  const charactersRemaining = maxLength - currentLength.length
  return(
    <small data-testid='character-counter'>{charactersRemaining}{' '}{t('characters left')}</small>
  )
}

CharacterCounter.propTypes = {
  currentLength: PropTypes.string,
  maxLength: PropTypes.number.isRequired,
}

CharacterCounter.defaultProps = {
  currentLength: '',
}

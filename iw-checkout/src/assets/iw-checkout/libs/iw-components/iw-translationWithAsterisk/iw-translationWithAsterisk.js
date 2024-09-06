import React from 'react'
import PropTypes from 'prop-types'

import { IWAsterisk } from '../iw-form'


export function IWTranslationWithAsterisk(props) {
    const { translation } = props
    const splitTranslation = translation.split('*')
    if (translation.startsWith('*')) {
        return (
            <span><IWAsterisk />{splitTranslation}</span>
        )
    } else if (translation.endsWith('*')) {
        return (
            <span>{splitTranslation}<IWAsterisk /></span>
        )
    } else {
        return (
            <span>{splitTranslation[0]}<IWAsterisk />{splitTranslation[1]}</span>
        )
    }
}


IWTranslationWithAsterisk.propTypes = {
    translation: PropTypes.string.isRequired,
}

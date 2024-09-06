import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils'
import { ToastList } from '@insight/toolkit-react'
import { QuickAdd } from '../../containers'

export default function Header(props) {
  const {
    addToast,
    toasts,
    dismissToast,
  } = props;
  const TOAST_DISPLAY_DURATION = 3000;
  const TOAST_FADE_DURATION = 250

  return (
    <div className="c-favorites__header">
      <h1 className="c-favorites__header-title u-h2">{t('Personal Product List')}</h1>
      <p className="c-favorites__header-text">{t('View, order, compare, add or remove items from your personalized list')}</p>
      <div className="c-favorites__header-wrapper">
        <QuickAdd addToast={addToast} />
        { toasts.length > 0 && <ToastList
            className="c-favorites-toasts"
            toasts={toasts}
            dismissToast={dismissToast}
            toastDisplayDuration={TOAST_DISPLAY_DURATION}
            toastFadeDuration={TOAST_FADE_DURATION}
          /> 
        }
      </div>
    </div>
  )
}

Header.propTypes = {
  addToast: PropTypes.func.isRequired
}

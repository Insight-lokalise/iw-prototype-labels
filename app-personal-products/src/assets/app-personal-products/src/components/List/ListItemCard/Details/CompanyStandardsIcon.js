import React from 'react'

import { t } from '@insight/toolkit-utils'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

export default function CompanyStandardsIcon() {
	return (
    <div className="c-favorites-cs">
      <Icon icon="pricetag" className="c-favorites-cs__icon" size="small" />
      <span className="c-favorites-cs__item">{t('Company Standards')}</span>
    </div>
  )
}

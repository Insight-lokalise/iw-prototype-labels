import React, { useContext, Fragment } from 'react'
import { t } from '@insight/toolkit-utils'
import { Field } from '@insight/toolkit-react'

import { LanguageContext, languageMap } from '../../lib'

export default function LanguageDropdown() {
  const { changeLanguage, language, languages } = useContext(LanguageContext)

  // shouldDisplay should only used in production, but the test team asked for it to be implemented before production
  const shouldDisplay = languages && languages.length && languages.length > 1
  return shouldDisplay ? (
    <div className="o-grid__item u-1/1">
      <div className="o-grid o-box u-padding-top-none">
        <div className="o-grid__item u-1/3 u-font-size-small u-padding-left-none">
          <Field
            fieldComponent={'Select'}
            fullWidth
            handleChange={e => {
              changeLanguage(e.target.value)
            }}
            label={t('Language display')}
            name={'Language display'}
            options={languages.map(l => ({ value: l, text: languageMap[l] }))}
            value={language}
          />
        </div>
      </div>
    </div>
  ) : null
}

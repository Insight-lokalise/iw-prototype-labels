import React, { Fragment }  from 'react'
import PropTypes from 'prop-types'
import { t } from 'api'
import { read } from '@constants'
import TnCTable from '../TnCTable/TnCTable'

export default function TnCPublishedSection({ terms, tncAddOrEdit, permission }) {

  const isReadOnly = read === permission

  return(
    <div className='o-grid u-padding-top u-margin-bot'>
      <div className='o-grid__item u-1/1 c-tc_heading'>
        <h3>{t('Published Terms and Revisions')}</h3>
      </div>
      {terms.length > 0 ?
        <Fragment>
          <div className='o-grid__item u-1/1 c-tc_heading'>
            {!isReadOnly && <p>{t('To add or change Sales Agreements click on Edit')}</p>}
            <p>{t('Total: ')} {terms.length} {t('results')}</p>
          </div>
          <TnCTable terms={terms} tncAddOrEdit={tncAddOrEdit} permission={permission} />
        </Fragment>
      :
        <div className='u-font-size-tiny'>
          {t('There are no published terms to display.')}
        </div>
      }
    </div>
  )
}

TnCPublishedSection.propTypes = {
  permission: PropTypes.string.isRequired,
  terms: PropTypes.arrayOf().isRequired,
  tncAddOrEdit: PropTypes.func.isRequired
}

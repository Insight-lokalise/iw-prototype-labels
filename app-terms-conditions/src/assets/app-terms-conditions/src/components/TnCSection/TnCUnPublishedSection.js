import React, { Fragment }  from 'react'
import PropTypes from 'prop-types'
import { t } from 'api'
import { TnCTable } from "../TnCTable";

export default function TnCUnPublishedSection({ terms, tncAddOrEdit, permission } ) {
  return(
    <div className='o-grid u-padding-top u-margin-bot'>
      <div className='o-grid__item u-1/1 c-tc_heading'>
        <h3>{t('Unpublished Terms and Revisions')}</h3>
      </div>
      {terms.length > 0 ?
        <Fragment>
          <div className='o-grid__item u-1/1 c-tc_heading'>
            <p>{t('Total: ')}{terms.length} {t('results')}</p>
          </div>
          <TnCTable terms={terms} tncAddOrEdit={tncAddOrEdit} permission={permission} />
        </Fragment>
      :
        <div className='u-font-size-tiny'>
          {t('There are no unpublished terms to display.')}
        </div>
      }
    </div>
  )
}

TnCUnPublishedSection.propTypes = {
  permission: PropTypes.string.isRequired,
  terms: PropTypes.arrayOf().isRequired,
  tncAddOrEdit: PropTypes.func.isRequired
}

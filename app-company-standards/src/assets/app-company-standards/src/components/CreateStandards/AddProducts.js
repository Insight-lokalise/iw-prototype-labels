import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, TabManager } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import BulkUploadTab from './BulkUploadTab'
import LabFeesTabContainer from '../../containers/LabFeesTabContainer'
import StandardEntryTab from './StandardEntryTab'

export default function AddProducts({ groupLabConfig, locale, isShared, productSetId }) {
  // ***** THE BULK_UPLOAD FEATURE WILL BE RELEASED POST-PILOT. PLEASE DO NOT DELETE! *****
  // const BULK_UPLOAD = {
  //   content: <BulkUploadTab locale={locale} productSetId={productSetId} />,
  //   id: 'bulk-upload',
  //   name: t('Bulk upload')
  // }

  // ***** THE LAB_FEES FEATURE WILL BE RELEASED POST-PILOT. PLEASE DO NOT DELETE! *****
  // const LAB_FEES = {
  //   content: <LabFeesTabContainer groupLabConfig={groupLabConfig} productSetId={productSetId} />,
  //   id: 'lab-fees',
  //   name: t('Lab fees')
  // }
  const STANDARD_ENTRY = {
    content: <StandardEntryTab productSetId={productSetId} isShared={isShared}/>,
    id: 'standard-entry',
    name: t('Standard entry')
  }

  // ***** THE BULK_UPLOAD AND LAB_FEES FEATURES WILL BE RELEASED POST-PILOT. PLEASE DO NOT DELETE! *****
  // const tabs = groupLabConfig === 'NONE' ? [STANDARD_ENTRY, BULK_UPLOAD] : [STANDARD_ENTRY, BULK_UPLOAD, LAB_FEES]
  const tabs = [STANDARD_ENTRY]

  return (
    <div className="o-grid u-margin-bot">
      <div className="o-grid__item u-1/1">
        <h2 className="u-margin-bot-none u-h5">{t('Add products')}</h2>
      </div>
      <TabManager className="o-grid__item u-1/2" initialSelectedTab={tabs[0]} tabs={tabs} />
    </div>
  )
}

AddProducts.propTypes = {
  groupLabConfig: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  productSetId: PropTypes.string.isRequired,
}

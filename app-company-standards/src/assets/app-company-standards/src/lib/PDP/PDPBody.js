import React from 'react'
import PropTypes from 'prop-types'
import { TabManager } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils'

import Details from './Details'
import Overview from './Overview'
import TechSpecs from './TechSpecs'

export default function PDPBody({
  description,
  overview,
  technicalSpecs,
  ...details
}) {
  const displayTech = technicalSpecs.length && technicalSpecs.length > 0
  const overviewTab = {
    content: (<Overview description={description} overview={overview} />),
    id: 'Overview',
    name: t('Overview'),
    className: 'c-pdp__tab--specs',
  }
  const techSpecsTab = {
    content: (<TechSpecs technicalSpecs={technicalSpecs} />),
    id: 'TechSpecs',
    name: t('Tech specifications'),
    className: 'c-pdp__tab--specs',
  }
  const tabs = displayTech ? [ overviewTab, techSpecsTab ] : [ overviewTab ]
  return (
    <div>
      <Details {...details} />
      <TabManager
        tabs={tabs}
      />
    </div>
  )
}

PDPBody.propTypes = {
  callForAvailability: PropTypes.bool,
  callForPrice: PropTypes.bool,
  coi: PropTypes.bool,
  coiStock: PropTypes.number,
  contractName: PropTypes.string,
  csi: PropTypes.bool,
  csiStock: PropTypes.number,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  listPrice: PropTypes.number,
  manufacturerId: PropTypes.string.isRequired,
  manufacturerImage: PropTypes.string.isRequired,
  materialId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  overview: PropTypes.string,
  regular: PropTypes.number,
  reserved: PropTypes.bool,
  reservedStock: PropTypes.number,
  technicalSpecs: PropTypes.arrayOf(PropTypes.object).isRequired,
  unitPrice: PropTypes.number.isRequired,
}

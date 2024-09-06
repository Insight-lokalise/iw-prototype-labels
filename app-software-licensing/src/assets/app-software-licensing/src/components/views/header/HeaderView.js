import React from 'react'
import PropTypes from 'prop-types';

import TopHeaderView from './TopHeaderView'

export default function HeaderView(props){
  const {
    contractAndAssortments,
    enableSelect,
    filterBy,
    filterByOptions,
    hasActiveContracts,
    isBrowseBySoftwareAgreementsEnabled,
    isExpandClicked,
    toggleExpanded,
    updateChildSelect,
    updatedParentState,
    agreementSize,
  } = props

  return (
    <div className='o-grid o-grid--gutters'>
      <TopHeaderView
        contractAndAssortments={contractAndAssortments}
        enableSelect={enableSelect}
        isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
        filterBy={filterBy}
        filterByOptions={filterByOptions}
        isExpandClicked={isExpandClicked}
        hasActiveContracts={hasActiveContracts}
        toggleExpanded={toggleExpanded}
        updateChildSelect={updateChildSelect}
        updatedParentState={updatedParentState}
        agreementSize={agreementSize}
      />
    </div>
  )
}

HeaderView.propTypes = {
  contractAndAssortments: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array,PropTypes.bool])),
  enableSelect: PropTypes.bool.isRequired,
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  filterByOptions: PropTypes.func.isRequired,
  filterBy: PropTypes.string.isRequired,
  hasActiveContracts: PropTypes.bool.isRequired,
  isExpandClicked: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
  updateChildSelect: PropTypes.func.isRequired,
  updatedParentState: PropTypes.bool.isRequired,
  agreementSize: PropTypes.number.isRequired,
}

HeaderView.defaultProps = {
  contractAndAssortments: {}
}

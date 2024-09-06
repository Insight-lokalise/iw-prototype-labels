import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@insight/toolkit-react/lib/Dropdown/Dropdown'

import { getContractResults, switchContract, t } from 'api'
import DropdownBody from './DropdownBody'
import DropdownButton from './DropdownButton'

export default function Contracts(props) {
  const [contractDetails, setContractDetails] = useState({ results: [], totalResults: 0 })

  useEffect(() => {
    handleSearch('')
  }, [])

  function handleSearch(searchTerm) {
    getContractResults(searchTerm).then(webGroupsResponse => {
      setContractDetails(webGroupsResponse)
    })
  }

  function handleSelect(selection) {
    switchContract(selection)
  }

  function renderButton(buttonProps) {
    return (
      <DropdownButton {...buttonProps} icon="clipboard" enabled={contractDetails && contractDetails.totalResults > 1}>
        {`${t('Contract')} – ${props.contract.name}`}
      </DropdownButton>
    )
  }

  return (
    <Dropdown
      id="contractDropdown"
      closeOnDropdownClick={false}
      className="c-header-account-menu__dropdown"
      dropdownMenuClassName="c-header-account-menu__dropdown-menu"
      position="full-width"
      renderButton={renderButton}
    >
      <DropdownBody
        currentItemId={props.contract.id}
        handleSearch={handleSearch}
        handleSelect={handleSelect}
        listItems={contractDetails ? contractDetails.results : []}
        type={'contract'}
      />
    </Dropdown>
  )
}

Contracts.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

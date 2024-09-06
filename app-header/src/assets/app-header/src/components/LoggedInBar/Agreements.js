import React, {useContext, useEffect, useState} from 'react'
import Dropdown from '@insight/toolkit-react/lib/Dropdown/Dropdown'
import { switchAgreement, t } from 'api'

import { ModalContext, MODALS } from '../Modal'
import DropdownBody from './DropdownBody'
import DropdownButton from './DropdownButton'
import IAHeaderContext from "../../context/IAHeaderContext";

export default function Agreements() {

  const {
    headerInfo: { userInformation },
  } = useContext(IAHeaderContext)

  const { consortiaAgreements,  defConsortiaId } = userInformation

  const [salesAgreements, setSalesAgreements] = useState({ results: [], totalResults: 0 })

  const agreementObject = consortiaAgreements.reduce((obj, item) => ({...obj, [item.id]: item.name}) ,{});

  const { setActiveModal } = useContext(ModalContext)

  useEffect(() => {
    handleSearch('')
  }, [])

  function handleSearch(searchTerm) {

    let filteredResults = consortiaAgreements

    if (searchTerm) {
      const regex = RegExp(searchTerm.toUpperCase())
      filteredResults = filteredResults.filter(result => regex.test(result.name.toUpperCase()))
    }

    filteredResults = filteredResults.map(result => ({
      ...result,
      displayName: result.name,
    }))

    setSalesAgreements ({
      results: filteredResults,
      totalResults: filteredResults.length,
    })
  }

  function handleSelect(selection) {
    setActiveModal(MODALS.SWITCH_SELECTION_MODAL, {
      onConfirm: () => {
        switchAgreement(selection)
      },
      title: t('You are about to change your sales agreement'),
    })
  }

  function renderButton(buttonProps) {
    return (
      <DropdownButton {...buttonProps} icon="clipboard" enabled={salesAgreements && salesAgreements.totalResults > 1}>
        {`${t('Contract')} – ${agreementObject[defConsortiaId]}`}
      </DropdownButton>
    )
  }

  return (
    <Dropdown
      id="agreementDropdown"
      closeOnDropdownClick={false}
      className="c-header-account-menu__dropdown"
      dropdownMenuClassName="c-header-account-menu__dropdown-menu"
      position="full-width"
      renderButton={renderButton}
    >
    <DropdownBody
      currentItemId={defConsortiaId}
      handleSearch={handleSearch}
      handleSelect={handleSelect}
      listItems={salesAgreements ? salesAgreements.results : []}
      type={'agreement'}
    />
    </Dropdown>
  )
}

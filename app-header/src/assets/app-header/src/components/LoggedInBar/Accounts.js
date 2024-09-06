import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@insight/toolkit-react/lib/Dropdown/Dropdown'
import listen from '@insight/toolkit-utils/lib/events/listen'

import { getAccounts, renderAccountSelectorFooter, switchAccount, t } from 'api'
import { ModalContext, MODALS } from '../Modal'
import DropdownBody from './DropdownBody'
import DropdownButton from './DropdownButton'

export default function Accounts(props) {
  const { account, isCES } = props
  const { setActiveModal } = useContext(ModalContext)
  const [accountDetails, setAccountDetails] = useState({
    results: [],
    totalResults: 0,
  })

  useEffect(() => {
    handleSearch('')

    return listen('account:switch', (data) => {
      handleSelect(data)
    })
  }, [])

  function handleSearch(searchTerm) {
    getAccounts(searchTerm).then((webGroupsResponse) => {
      setAccountDetails(webGroupsResponse)
    })
  }

  function handleSelect(selection) {
    setActiveModal(MODALS.SWITCH_SELECTION_MODAL, {
      onConfirm: () => {
        switchAccount(selection)
      },
      title: t('Change account'),
    })
  }

  function renderButton(buttonProps) {
    const noDefaultAccount = account.id === ''
    const displayText = noDefaultAccount
      ? `${t('No account selected')}`
      : `${t('Account')} – ${account.displayId || account.id || ''} ${
          account.name ? account.name : ''
        }`

    return (
      <DropdownButton
        {...buttonProps}
        enabled={accountDetails && accountDetails.totalResults > 1}
        icon="person"
      >
        {displayText}
      </DropdownButton>
    )
  }

  return (
    <Dropdown
      id="accountDropdown"
      closeOnDropdownClick={false}
      className="c-header-account-menu__dropdown"
      dropdownMenuClassName="c-header-account-menu__dropdown-menu"
      position="full-width"
      renderButton={renderButton}
      ariaLabel={t('Account menu mobile')}
    >
      <DropdownBody
        currentItemId={props.account.id}
        handleSearch={handleSearch}
        handleSelect={handleSelect}
        listItems={accountDetails ? accountDetails.results : []}
        type={'account'}
      >
        {renderAccountSelectorFooter(accountDetails.totalResults)}
      </DropdownBody>
    </Dropdown>
  )
}

Accounts.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

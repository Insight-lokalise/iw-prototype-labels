import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import Message from '@insight/toolkit-react/lib/Message/Message'
import listen from '@insight/toolkit-utils/lib/events/listen'
import { getAccounts, t } from 'api'
import DropdownBody from '../../LoggedInBar/DropdownBody'

export default function DefaultAccountModal(props) {
  const { account, handleSelect } = props
  const [accountDetails, setAccountDetails] = useState({ results: [], totalResults: 0 })

  useEffect(() => {
    handleSearch('')

    return listen('account:switch', data => {
      handleSelect(data)
    })
  }, [])

  const handleSearch = async (searchTerm) => {
    const webGroupsResponse = await getAccounts(searchTerm)
    setAccountDetails(webGroupsResponse)
  }

  return (
    <Modal isOpen closeOnOutsideClick={false} closeOnEsc={false} size="medium">
      <Modal.Body>
        <div className='c-default-account-modal'>
          <Message className='error-message' type="error">{t('Select an account from the list to continue')}.</Message>
          <DropdownBody
            currentItemId={account.id}
            handleSearch={handleSearch}
            handleSelect={handleSelect}
            listItems={accountDetails ? [...accountDetails.results] : []}
            type={'account'}
          >
          </DropdownBody>
        </div>
      </Modal.Body>
    </Modal>
  )
}

DefaultAccountModal.propTypes = {
  account: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
}

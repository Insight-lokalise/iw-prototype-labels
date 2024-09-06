import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Message } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import UniversalMessageContext from '../UniversalMessages/UniversalMessageContext'
import { MESSAGE_TYPES } from "../UniversalMessages"

export default function AddToSetButton({ onSuccess, validateItemsAndAddToProductSet, materialIds, isShared }) {
  const [invalidPartNumbers, setInvalidPartNumbers] = useState([])
  const [duplicatePartNumbers, setDuplicatePartNumbers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleAdd() {
    setInvalidPartNumbers([])
    setDuplicatePartNumbers([])
    setIsLoading(true)
      validateItemsAndAddToProductSet()
      .then(res => {
        const { invalid, duplicates } = res
        setInvalidPartNumbers(invalid)
        setDuplicatePartNumbers(duplicates)
        setIsLoading(false)
        onSuccess(res)
        if (materialIds.length - [...invalid, ...duplicates].length > 0) {
          setActiveMessage({ text: t('Parts added successfully'), type: MESSAGE_TYPES.SUCCESS })
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Button color="primary" isDisabled={isShared} onClick={handleAdd} isLoading={isLoading}>
        {isShared? t('Shared copy') :t('Add to set')}
      </Button>
      {invalidPartNumbers && invalidPartNumbers.length !== 0 && 
        <Message className='c-cs-admin-addset-error' type='error'>
          <span>{`${t('The following part numbers are invalid:')} ${invalidPartNumbers.map((num, i) => i === invalidPartNumbers.length - 1 ? `${num}` : `${num}, `)}`}</span>
        </Message>}
      {duplicatePartNumbers && duplicatePartNumbers.length !== 0 &&
        <Message className='c-cs-admin-addset-error' type='error'>
          <span>{`${t('The following part numbers are duplicates:')} ${duplicatePartNumbers.map((num, i) => i === duplicatePartNumbers.length - 1 ? `${num}` : `${num}, `)}`}</span>
        </Message>}
    </div>
  )
}

AddToSetButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  validateItemsAndAddToProductSet: PropTypes.func.isRequired,
  materialIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}

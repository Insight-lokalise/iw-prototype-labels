import React from 'react'
import { Message } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import {
  INVALID_ID_TEXT,
  INVALID_IDS_TEXT,
  CONTACT_MESSAGE,
} from '../../constants'

const materialId = item => (typeof item === 'string' ? item : item?.materialId)

const CartMessages = (props) => {
  const { invalidMaterialIds } = props

  const invalidItems = invalidMaterialIds?.map(materialId).filter(item => item != null)
  const hasInvalidItems = invalidItems?.length > 0

  if(!hasInvalidItems) return null

  const invalidIdText = t(INVALID_ID_TEXT)
  const invalidIdsText = t(INVALID_IDS_TEXT)
  const contactMessage = t(CONTACT_MESSAGE)
  
  const invalidText = invalidItems.length > 1 ? invalidIdsText : invalidIdText
  const invalidIDs = [...new Set(invalidItems)].join(',')

  return (
    <Message type="warning">
      {invalidText + ' ' + invalidIDs + '.' + ' ' + contactMessage}
    </Message>
  )
}

export default CartMessages

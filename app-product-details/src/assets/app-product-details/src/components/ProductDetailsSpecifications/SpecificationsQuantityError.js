import React from 'react'
import PropTypes from 'prop-types'
import { Message } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export const SpecificationsQuantityError = ({
  availableQuantity,
  isQuantityError,
}) => {
  if (!isQuantityError) return null
  return (
    <section className="c-product-specifications__quantity-error">
      <Message type="error">
        {t(
          `Your quantity exceeds our current stock of ${availableQuantity}. The maximum quantity has been entered.`
        )}
      </Message>
    </section>
  )
}

SpecificationsQuantityError.propTypes = {
  availableQuantity: PropTypes.number.isRequired,
  isQuantityError: PropTypes.bool.isRequired,
}

export default SpecificationsQuantityError

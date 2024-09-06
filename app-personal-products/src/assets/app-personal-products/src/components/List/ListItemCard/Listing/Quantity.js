import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default class Quantity extends Component {

  onBlur = ({ target }) => {
    const { handleQuantityChange } = this.props
    const quantity = target.value
    if (quantity === '') {
      handleQuantityChange(1)
    }
  }

  onChange = ({ target }) => {
    const { handleQuantityChange } = this.props
    const quantity = Number(target.value)
    const isNaN = quantity.toString() === 'NaN'
    if (!isNaN) {
      handleQuantityChange(quantity < 1 ? '' : quantity)
    }
  }

  render() {
    const {
      quantity,
      stock,
      isUnlimitedStock,
    } = this.props
    const stockText = ` ${t('Stock')}: ${stock}`
    const { onChange, onBlur } = this
    return (
      <div className="c-item-card__quantity o-grid__item">
        <p className="c-item-card__quantity-label">{t('Qty')}</p>
        <div className="c-item-card__field-container">
          <Field
            className="c-item-card__quantity-input"
            fieldComponent="Text"
            id="itemCardQuantity"
            handleChange={onChange}
            value={quantity}
            handleBlur={onBlur}
          />
        </div>
        {isUnlimitedStock ?
          <div className="c-item-card__unlimitedStock">
            <span>{t('Unlimited availability')}</span>
          </div>
          :
          <div className="c-item-card__stock" data-testid='stockIsLimited'>
            <Icon icon="checkmark-circled" type="success" />
            <span>{stockText}</span>
          </div>
        }
      </div>
    )
  }
}

Quantity.propTypes = {
  handleQuantityChange: PropTypes.func.isRequired,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  stock: PropTypes.number,
  isUnlimitedStock: PropTypes.bool
}

Quantity.defaultProps = {
  stock: null,
  isUnlimitedStock: false
}

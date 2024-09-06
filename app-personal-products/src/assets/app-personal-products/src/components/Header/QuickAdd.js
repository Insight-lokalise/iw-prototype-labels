import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Field, Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default class QuickAdd extends Component {
  state = {
    inputValue: '',
    isSubmitting: false,
  }

  onInputKeyUp = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    this.setState({ isSubmitting: true }, this.addToPersonalProducts)
  }

  handleInputChange = ({ target: { value } }) => {
    this.setState({ inputValue: value })
  }

  addToPersonalProducts() {
    const { inputValue } = this.state
    const { materialList } = this.props
    const normalizedInputValue = inputValue.split(',').filter(i => i !== "").map(item => item.toUpperCase().trim())
    const { duplicates, itemsToAdd } = seperateDuplicateParts(materialList, normalizedInputValue)
    if (duplicates.length > 0) {
      const text = (<div>{t('Part number(s) already exists:')} {duplicates.join(', ')}</div>)
      this.props.addToast({
        type: 'warning',
        text,
        id: 'duplicate items',
      });
    }
    const isItemsEligibleToAdd = itemsToAdd.length > 0
    if (isItemsEligibleToAdd) {
      this.props.addToPersonalProductsList(itemsToAdd).then(() => {
        const { invalidProducts, numberOFPartsAdded, hasDEP } = this.props
        if (invalidProducts.length > 0) {
          const text = (<div>{t('Please enter a valid part number(s):')} {invalidProducts.join(', ')}</div>)
          this.props.addToast({
            type: 'danger',
            text,
            id: 'invalid items',
          });
        }
        this.clearInput()
        if (numberOFPartsAdded) {
          this.props.addToast({
            id: 'added items',
            text: (<div>{t('Part(s) added to your list.')}</div>),
            type: 'success',
          })
        }
        if(hasDEP) {
          this.props.addToast({
            type: 'warning',
            id: 'DEP items',
            text: (<div>{t('DEP services can be configured on the cart.  The service cannot be added as a single part.  Please add the desired part and proceed to the cart to configure DEP.')}</div>),
          })
        }
      })
    } else {
      this.clearInput()
    }
  }

  clearInput = () => {
    this.setState({ isSubmitting: false, inputValue: '' })
  }

  render() {
    const { inputValue, isSubmitting } = this.state
    return (
      <div className='c-favorites__header-parts'>
        <div className="c-favorites__header-parts__wrapper">
          <p className="c-favorites__header-parts__text">{t('Add item(s) to your list')}</p>
          <Field
            className="c-favorites__header-parts__input"
            fieldComponent="Text"
            handleChange={this.handleInputChange}
            helpText={t('Separate multiple part numbers with a comma.')}
            helpTextClass="c-favorites__header-parts__input-help"
            id="add-favorite-item"
            isLoading={isSubmitting}
            name="partNumber"
            placeholder={t('Product part number')}
            value={inputValue}
            onKeyUp={this.onInputKeyUp}
            aria-label="addFavoriteItem"
            class="c-favorite-parts__input"
          />
          <Button
            aria-label={t('Add Part to your list')}
            className="c-favorites__header-parts__submit u-no-wrap"
            color="primary"
            disabled={inputValue === ''}
            isLoading={isSubmitting}
            onClick={this.handleSubmit}
            size="small"
          >
            {t('Add')}
          </Button>
        </div>
      </div>
    )
  }
}

QuickAdd.propTypes = {
  addToPersonalProductsList: PropTypes.func.isRequired,
  addToast: PropTypes.func.isRequired,  
  numberOFPartsAdded: PropTypes.number.isRequired,
  invalidProducts: PropTypes.arrayOf(PropTypes.string).isRequired,
  materialList: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasDEP: PropTypes.bool.isRequired,
}


const seperateDuplicateParts = (currentArray, newItemsToAdd) => {
  const duplicates = []
  const itemsToAdd = []
  newItemsToAdd.forEach(i => {
    if (currentArray.includes(i)) {
      duplicates.push(i)
    } else {
      itemsToAdd.push(i)
    }
  })
  return { duplicates, itemsToAdd }
}

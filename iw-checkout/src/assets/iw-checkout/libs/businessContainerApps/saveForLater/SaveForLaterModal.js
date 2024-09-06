import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWInput } from '../../iw-components'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { saveCart } from './models.js'
import ROUTES from '../../../libs/routes'


export default class SaveForLaterModal extends Component {
    constructor() {
        super()
        this.state = {
            clearCart: false,
            hasDuplicateName: false,
            blankSubmission: false,
            isLoading: false,
            isSuccessful: false,
            isTooLong: false,
            text: '',
        }
    }

    onCancel = () => {
        const { isSuccessful,clearCart } = this.state
        if(isSuccessful && clearCart) {
            this.redirectToWelcome()
        }
        else {
            this.resetModal()
            this.props.closeModal()
        }
    };

    onComplete = () => {
        const { clearCart } = this.state
        this.onCancel()
        if (clearCart) this.redirectToWelcome()
    };

    onConfirm = e => {
        e.stopPropagation()
        const { text, clearCart, hasDuplicateName, isTooLong } = this.state
        const { saveCartModalIsOpen } = this.props
        const type = saveCartModalIsOpen ? 'Cart' : 'Template'

        // Return early to prevent API call for blank names
        if (text === '') {
            this.setState({ blankSubmission: true })
            return
        }
        if (isTooLong) return

        this.setState({ isLoading: true })
        saveCart(text, type, clearCart, hasDuplicateName).then((r) => {
            this.setState({
                emptyName: false,
                hasDuplicateName: false,
                blankSubmission: false,
                isFailure: false,
                isLoading: false,
                isSuccessful: false,
                needUniqueName: false,
            })
            switch (r.response) {
                case 'Need Unique Name': {
                    this.setState({ needUniqueName: true })
                    break
                }
                case 'Name Taken': {
                    this.setState({ hasDuplicateName: true })
                    break
                }
                case 'success': {
                    this.setState({ isSuccessful: true })
                    break
                }
                default: {
                    this.setState({ isFailure: true })
                    break
                }
            }
        })
    };

    handleChange = e => {
        this.setState({
            text: e.target.value,
            hasDuplicateName: false,
            blankSubmission: e.target.value === '',
            isTooLong: e.target.value.length > 55,
        })
    };

    handleCheckbox = e => {
        this.setState({ clearCart: e.target.checked })
    };

    redirectToWelcome() {
        window.location = `/insightweb${ROUTES.WELCOME}`
    }

    resetModal = () => {
        this.setState({
            hasDuplicateName: false,
            blankSubmission: false,
            isLoading: false,
            isSuccessful: false,
            text: '',
        })
    };

    render() {
        const {
            clearCart,
            hasDuplicateName,
            blankSubmission,
            isFailure,
            isLoading,
            isSuccessful,
            isTooLong,
            needUniqueName,
            text,
        } = this.state
        const {
            saveCartModalIsOpen,
            orderTemplateModalIsOpen,
        } = this.props
        const title = t(saveCartModalIsOpen ? 'Save Cart Contents' : 'Save Order Template')
        const saveTypeText = saveCartModalIsOpen ? 'cart' : 'order template'
        const errorMessage = (text === '' && t('A name is required'))
            || (needUniqueName && t('That name is unavailable. Please enter a different name.'))
            || (hasDuplicateName && t('This name is already registered,  please try another name or click Save to overwrite the existing cart'))
            || (isTooLong && t(`Name of saved ${saveTypeText} exceeds 55 characters.`))
            || t('There was an error saving your cart. Please try again later.')
        return (
          <Modal
            isOpen={saveCartModalIsOpen || orderTemplateModalIsOpen}
            overlayclassname="c-modal-overlay"
             size="medium"
            onClose={this.onCancel}
            data-testid={'saved-carts-form'}
            closeOnOutsideClick={false}
          >
            <Modal.Header onClick={()=>{}}>
              <h1 className='u-h3'>{title}</h1>
            </Modal.Header>
            <Modal.Body>
              {
                isSuccessful ?
                  <div className="save-for-later__modal-messages">
                    <p className="save-for-later__modal-success">{t(`Your ${saveTypeText} has been successfully saved.`)}</p>
                    <p>{t('Access your saved carts and order templates under the Tools menu.')}</p>
                  </div>
                  :
                  <div className="save-for-later__modal-content">
                    <IWInput
                      errorMessage={errorMessage}
                      label={t(`Please enter a name for your ${saveTypeText}`)}
                      aria-label={t(`Please enter a name for your ${saveTypeText}`)}
                      name={t('Saved Name')}
                      onChange={this.handleChange}
                      required
                      showError={hasDuplicateName || blankSubmission || needUniqueName || isTooLong || isFailure}
                      type={'text'}
                      value={text}
                    />
                    <label className="save-for-later__modal-checkbox">
                      <input
                        name='clearCheckbox'
                        type='checkbox'
                        checked={clearCart}
                        onChange={this.handleCheckbox}
                      />
                      {t('Clear my cart after save')}
                    </label>
                  </div>
              }
              <ButtonGroup align='right'>
                <Button color="link" isLoading={isLoading} onClick={this.onCancel}>{isSuccessful? undefined :t('Cancel')}</Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  data-testid='saved-carts-save-btn'
                  onClick={
                    (isSuccessful && this.onComplete) ||
                    (isLoading && ((e) => { e.stopPropagation() })) ||
                    ((e) => this.onConfirm(e))
                  }
                >
                  {
                    (isSuccessful && t('Continue')) ||
                    (isLoading && t('Processing ')) ||
                    t('Save')
                  }
                </Button>
              </ButtonGroup>
            </Modal.Body>
          </Modal>

        )
    }
}

SaveForLaterModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    saveCartModalIsOpen: PropTypes.bool.isRequired,
    orderTemplateModalIsOpen: PropTypes.bool.isRequired,
}

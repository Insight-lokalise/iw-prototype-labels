import React, {useState} from 'react'
import { t } from '@insight/toolkit-utils';
import { ButtonGroup, Button, Modal, Form, Field } from '@insight/toolkit-react'


const SaveAsListModal = ({ isOpen, onClose, onSaveList }) => {

  const [isClearCheckbox, setIsClearCheckbox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [error, setError] = useState(null)

  const onCloseHandler = () => {
    onClose(isClearCheckbox)
    setIsSuccessful(false)
  }

  const validateForm = (values) => {
    const errors = {}
    if (!values.listName && !values.listName.trim()) {
      errors.listName = t('Please enter list name')
    }
    return errors
  }

  const onSubmit = (values) => {
    const {listName, clearCheckbox} = values
    setIsClearCheckbox(clearCheckbox)
    setIsLoading(true)
    onSaveList({name: listName.trim(), isClearCart: clearCheckbox}).then(()=>{
      setIsLoading(false)
      setIsSuccessful(true)
    }).catch((e)=>{
      setIsLoading(false)
      setError(e)
    })

  }

  const onViewSavedLists = () => {
    window.location = '/insightweb/savedLists'
  }

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onCloseHandler} data-testid={'save-as-list-form'} closeOnOutsideClick={false}>
      <Modal.Header onClick={()=>{}}>
        <h1 className='u-h3'>{t('Save list')}</h1>
      </Modal.Header>
      <Modal.Body id='save-as-list-body'>
        {!isSuccessful ? <div>
            <p>{t("Creating a list will save your current cart items for future use.")}</p>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              skipValidateOnMount
              validateOnBlur
              render={({handleSubmit}) => (
                <form onSubmit={handleSubmit} className="c-form">
                  <fieldset className="c-form__group" data-private="true">
                    <div className="o-grid o-grid--gutters-small">
                      <Field
                        fieldComponent='Text'
                        name='listName'
                        label={t('List name')}
                        type="text"
                        aria-required="true"
                        required
                        minLength={1}
                        maxLength={40}
                        autoFocus
                        showErrorIcon
                        className='o-grid__item  u-1/1  u-1/1@desktop  u-margin-bot'
                        data-testid={'list-name-input'}
                      />
                      <Field
                        checked={isClearCheckbox}
                        fieldComponent={'Checkbox'}
                        name='clearCheckbox'
                        handleChange={() => {
                          setIsClearCheckbox(!isClearCheckbox)
                        }}
                        checkboxLabel={t('Clear my cart after saving')}
                        className='c-save-list-clear-cart-checkbox o-grid__item  u-1/1  u-1/1@desktop  u-margin-bot'
                        data-testid='clear-cart-checkbox'
                      />

                    </div>
                  </fieldset>
                  <ButtonGroup align='right'>
                    <Button size={"small"} color="link" isLoading={isLoading} onClick={onCloseHandler}>{t('Cancel')}</Button>
                    <Button
                      size={"small"}
                      color="primary"
                      isLoading={isLoading}
                      data-testid='save-as-list-save-btn'
                      onClick={handleSubmit}
                    >
                      {t('Save')}
                    </Button>
                  </ButtonGroup>
                </form>
              )}
            />
          </div> :
          <div className="o-grid">
            <div className="o-grid__item u-text-bold u-text-center u-1/1 u-margin-bot-small">
              {t("Your cart has been successfully saved as a list.")}
            </div>
            <div className="o-grid__item u-text-center u-1/1 u-margin-bot-small">
              <Button
                size={"small"}
                color="inline-link"
                data-testid='save-as-list-continue-btn'
                onClick={onViewSavedLists}
              >
                {t("View your saved lists")}
              </Button>

              {` ${t("or access them from the account menu.")}`}
            </div>
            <div className="o-grid__item u-1/1">
              <ButtonGroup align='right'>
                <Button
                  size={"small"}
                  color="primary"
                  isLoading={isLoading}
                  data-testid='save-as-list-continue-btn'
                  onClick={onCloseHandler}
                >
                  {t('Continue')}
                </Button>
              </ButtonGroup>
            </div>

          </div>}

      </Modal.Body>
    </Modal>
  )
}

export default SaveAsListModal;

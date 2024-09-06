import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, ButtonGroup, Field, Modal } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { fetchFindAndReplace, putFindAndReplace } from '../../../api'

export default function FindAndReplaceModal(props) {
  const { lang, webGroupId } = props

  const [findInput, setFindInput] = useState('')
  const [foundProductSets, setFoundProductSets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [replaceInput, setReplaceInput] = useState('')
  const [searchedFor, setsearchedFor] = useState('')
  const [selectedProductSets, setSelectedProductSets] = useState([])

  const selectAllIsChecked = foundProductSets.length > 0 && selectedProductSets.length === foundProductSets.length

  function handleFind() {
    if (findInput) {
      setIsLoading(true)
      fetchFindAndReplace({ lang, materialId: findInput, wId: webGroupId })
        .then(foundPgs => {
          setsearchedFor(findInput)
          setFoundProductSets(foundPgs)
          setIsLoading(false)
        })
        .catch(() => {
          setsearchedFor(findInput)
          setIsLoading(false)
        })
    }
  }

  function handleReplace() {
    setIsLoading(true)
    putFindAndReplace({ searchedFor, selectedProductSets, replaceInput })
      .then(() => {
        setIsLoading(false)
        props.onClose()
      })
      .catch(() => {
        // TODO: Implement error display
        setIsLoading(false)
      })
  }

  function handleSelectAllChange() {
    setSelectedProductSets(selectAllIsChecked ? [] : foundProductSets.map(({ productSetId }) => productSetId))
  }

  function addToSelectedProductSets(productSetId) {
    setSelectedProductSets(prevSelectedProductSets => [...prevSelectedProductSets, productSetId])
  }

  function removeFromSelectedProductSets(productSetId) {
    setSelectedProductSets(prevSelectedProductSets => {
      const nextSelectedProductSets = [...prevSelectedProductSets]
      nextSelectedProductSets.splice(prevSelectedProductSets.indexOf(productSetId), 1)
      return nextSelectedProductSets
    })
  }

  return (
    <Modal isOpen onClose={props.onClose}>
      <Modal.Header>{t('Find and replace parts')}</Modal.Header>
      <Modal.Body>
        <div className="o-grid">
          <div className="o-grid__item u-1/1 u-margin-bot">
            <div className="o-grid o-grid--bottom">
              <Field
                className="o-grid__item u-margin-bot-none u-3/4"
                id="find-input"
                name="findInput"
                label={t('Find part number')}
                onChange={e => {
                  setFindInput(e.target.value)
                }}
                fieldComponent="Text"
                value={findInput}
              />
              <Button className="o-grid__item u-1/4" color="link" isLoading={isLoading} onClick={handleFind}>
                {t('Find')}
              </Button>
            </div>
          </div>
          <div className={cn('o-grid__item u-1/1', { 'u-invisible': !searchedFor })}>
            <div className="o-grid">
              <div className="o-grid__item u-1/1 u-margin-bot">
                <div className="o-grid o-grid--bottom">
                  <Field
                    className="o-grid__item u-3/4"
                    id="replace-input"
                    name="replaceInupt"
                    label={t('Replace with part number')}
                    onChange={e => {
                      setReplaceInput(e.target.value)
                    }}
                    fieldComponent="Text"
                    value={replaceInput}
                  />
                </div>
              </div>
              <div className="o-grid__item u-1/1 u-margin-bot">
                <div className="o-grid">
                  <div className="o-grid__item u-1/1 u-padding-small">
                    <Field
                      checkboxLabel={'Select all'}
                      checked={selectAllIsChecked}
                      fieldComponent={'Checkbox'}
                      handleChange={handleSelectAllChange}
                      name={'selectAll'}
                    />
                  </div>
                  <div className="o-grid__item u-1/1">
                    <div className="o-grid u-border u-padding-small c-find-and-replace__selection-box">
                      {foundProductSets.length > 0 ? (
                        foundProductSets.map(({ path, productSetId }) => {
                          const checked = selectedProductSets.includes(productSetId)
                          return (
                            <div className="o-grid__item u-1/1" key={productSetId}>
                              <Field
                                checkboxLabel={path}
                                checked={checked}
                                fieldComponent={'Checkbox'}
                                handleChange={() =>
                                  checked
                                    ? removeFromSelectedProductSets(productSetId)
                                    : addToSelectedProductSets(productSetId)
                                }
                                name={'selectItem'}
                              />
                            </div>
                          )
                        })
                      ) : (
                        <div className="o-grid__item u-1/1 u-font-size-tiny">
                          {`${t('No parts found matching:')} ${searchedFor}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="o-grid__item u-1/1">
                <div className="o-grid o-grid--justify-right u-border-top u-padding-top">
                  <ButtonGroup align="right">
                    <Button color="secondary" onClick={props.onClose}>
                      {t('Cancel')}
                    </Button>
                    <Button
                      color="primary"
                      isDisabled={!replaceInput || selectedProductSets.length === 0}
                      isLoading={isLoading}
                      onClick={handleReplace}
                    >
                      {t('Replace')}
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

FindAndReplaceModal.propTypes = {
  lang: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
}

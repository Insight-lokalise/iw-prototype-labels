import React, { useEffect, useState } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Loading from "@insight/toolkit-react/lib/Loading/Loading"; 
import StaticFormField from '../StaticFormField'
import {fetchPersonalInformation, savePreferences} from '../../api'
import PreferencesModal from "./PreferencesModal";

const Preferences = ({addToast}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [prefs, setPrefs] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(()=>{
    fetchPersonalInformation().then((data)=>{
      setPrefs(data)
      setIsLoading(false)
    })
  }, [])

  const onModalClose = () => {
    setModalIsOpen(false)
  }

  const onModalSubmit = (values) => {
    savePreferences(values).then((data)=>{
      onModalClose()
      addToast({message: t('Preferences were successfully updated'), type:'success'})
      fetchPersonalInformation(true).then((refresh)=>{
        setPrefs(refresh)
      })
    }).catch(()=>{
      addToast({message: t('Failed to save preferences'), type:'warning'})
    })
  }

  return(
    <div className='c-preferences c-panel-border'>
      <Panel>
        <Panel.Title className='c-ac-panel-title'>
          <Panel.Title.Left><h2 className='u-h5 u-text-bold u-margin-bot-none'>{t('Preferences')}</h2></Panel.Title.Left>
          {!isLoading &&
          <Panel.Title.Button
            icon="create"
            className='c-ac-title-icon'
            data-testid='preferences-edit-btn'
            onClick={() => setModalIsOpen(!modalIsOpen)}>
            <span className='u-hide-visually'>{t('Edit Preferences')}</span>
          </Panel.Title.Button>
          }
        </Panel.Title>
        <Panel.Body>
          {isLoading ? <Loading /> : (
            <div className='o-grid'>
              <div className='o-grid__item u-1/1'>
                <StaticFormField
                  data-testid='name'
                  className={'c-static-form-field'}
                  label={t('Email format')}
                  value={`${prefs.emailFormat}` || '-'} />
              </div> 
              <div className='o-grid__item u-1/1'>
                <div className={"c-form__element is-static"}>
                  <span className="c-form__label">{t('Email confirmations')}</span>
                  <div className="c-form__control c-personal-info__container">
                    {!prefs.orderQuotes && !prefs.emailQuotes ?
                    (<p>-</p>) :
                    (
                      <>
                        { prefs.orderQuotes && <p className="c-personal-info__confirm">{t('On orders placed')}</p> }  
                        { prefs.emailQuotes && <p className="c-personal-info__confirm">{t('On quotes placed')}</p> }
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Panel.Body>
      </Panel>
      { modalIsOpen && <PreferencesModal isOpen={modalIsOpen} onClose={onModalClose} prefs={prefs} onSubmit={onModalSubmit} /> }
    </div>
  )
}

export default Preferences;

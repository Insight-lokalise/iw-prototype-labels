import React, { useEffect }  from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown } from '@insight/toolkit-react'
import Flag from '@insight/toolkit-react/lib/Flag/Flag'
import { country, countryMap, read } from '@constants'
import { useCreateTnCContext, useTnCsContext } from '@context'
import { APILoading } from '@components'
import { t } from 'api'

export default function TnCHeader({ permission, tncAddOrEdit }) {

  const {
    actions: {
      setAgreementValid,
      setEditView,
      setPreviewView,
      setPublishedStatus,
      setSavedTNC
    },
    editView,
    previewView
  } = useCreateTnCContext()

  const {
    actions: {
      getSalesArea,
      getTnCs,
      setNewTnC,
      setSelectedSalesArea,
    },
    error,
    salesArea,
    salesAreaLoading,
    selectedLocale,
    selectedSalesArea,
    newTnC
  } = useTnCsContext()


  const isReadOnly = read === permission

  const showBackButton = !editView && !newTnC && !previewView

  const setDefaultLocale = (locale) => {
    return(
      <div>
        <Flag country={locale} />
        <span className='c-tc-country'>{country[locale]}</span>
      </div>
    )
  }

  const changeSalesOrg = (locale, salesOrg) => {
    setSelectedSalesArea({ selectedLocale: locale, selectedSalesArea: salesOrg})
    getTnCs(salesOrg)
  }

  const backToDefault = () => {
    setAgreementValid(false)
    setEditView(false)
    setNewTnC(false)
    setPreviewView(false)
    setPublishedStatus(false)
    setSavedTNC(false)
  }

  useEffect(() => {
    (async () => {
      await getSalesArea()
      setSelectedSalesArea({selectedLocale, selectedSalesArea})
      getTnCs(selectedSalesArea)
    })()
  }, {})

  return(
    <div className='o-grid u-margin-top u-margin-bot-small u-border-bot c-tc__header clear'>
      <div className='o-grid__item u-1/2'>
        <div className='o-grid'>
          <div className='o-grid__item u-3/4'>
            <h1>{t('Terms and Conditions Workplace')}</h1>
            {!showBackButton && <Button color="link" className='c-tc__back' onClick={() => backToDefault()}>{t('<< Back')}</Button>}
          </div>
          {showBackButton &&
            <div className='o-grid__item u-1/4'>
            <APILoading data={salesArea} error={error} loading={salesAreaLoading}>
              {salesArea => {
                return (
                  <Dropdown className='c-tc-countryDropdown' position="left" text={setDefaultLocale(selectedLocale)} color="subtle" id="dropdown">
                    {countryMap(salesArea).map(sales => {
                      return (
                        <div onClick={() => changeSalesOrg(sales.locale, sales.salesOrg)}>
                          <Flag country={sales.locale} />
                          <span className='c-tc-country'>{country[sales.locale]}</span>
                        </div>
                      )
                    })}
                  </Dropdown>
                )
              }}
            </APILoading>
            </div>
          }
        </div>
      </div>
      {showBackButton && !isReadOnly && <div className='o-grid__item u-text-right u-1/2'>
          <Button  color="primary" onClick={() => tncAddOrEdit(false)}>
            {t('Add New')}
          </Button>
        </div>
      }
    </div>
  )
}

TnCHeader.propTypes = {
  permission: PropTypes.string.isRequired,
  tncAddOrEdit: PropTypes.func.isRequired
}

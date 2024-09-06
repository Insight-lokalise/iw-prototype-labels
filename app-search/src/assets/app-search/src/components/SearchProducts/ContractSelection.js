import React, { useEffect, useState } from 'react'
import {
  connectToLocale,
  Currency,
  Button,
  Dropdown,
  Field,
  Loading,
  Message,
  Tooltip,
  currencyFormat
} from '@insight/toolkit-react'
import { t,  } from '@insight/toolkit-utils'
import isMobile from '@insight/toolkit-utils/lib/media/isMobile'
import throttle from '@insight/toolkit-utils/lib/timing/throttle'
import { ILISTVIEW, CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE } from '../../constants'

function ContractSelection({
  context,
  priceInfo,
  view,
  locale,
  currency,
  selectedContract,
  setSelectedContract,
  materialId,
  isContractLoading,
  isContractTimedOut
}) {
  const displayContracts = (!!priceInfo?.additionalPrices)? priceInfo?.additionalPrices: [priceInfo]
  const showIcon = displayContracts?.length > 3
  const [isOnMobile, setIsOnMobile] = useState(isMobile())
  const [isShowMore, setIsShowMore] = useState(true)

  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const { currencyCode, isIPSUser } = context
  // when is user is in mobile screen, view should always be grid
  const list = view === ILISTVIEW.list && !isOnMobile
  const grid = view === ILISTVIEW.grid || isOnMobile

  const getDisplayPrice = (webPrice, locale, currency) => {
    const { value } = currencyFormat(webPrice, locale, currency);
    return value
  }

  let contractOptions = []
  if(!!priceInfo){
      displayContracts?.map((displayContract,index) => {
      contractOptions.push({
          id: displayContract?.contractNumber,
          text: index === 0?
            `${displayContract?.contractName} Best price`
            : (!!displayContract.abbreviation) ?
              `${getDisplayPrice(displayContract?.webPrice, locale, currency)} - ${displayContract?.abbreviation}`
              :`${getDisplayPrice(displayContract?.webPrice, locale, currency)} - ${displayContract?.contractName}`
      })
    })
  }

  const contractRenderer = (options, initialSelection) => (
    options.map(option=>(
        <option id={option?.id} key={option?.id} value={option?.id}>
            {option.text}
        </option>
      )
    )
  )

  const setCurrentContractFromSelection = (selectedId) => {
    const result = priceInfo?.additionalPrices?.find(contract => Number(contract?.contractNumber) === Number(selectedId));
    setSelectedContract(result)
  }

  return (
    <div className="o-grid c-list-item__contract-border contract-width">
      {list && <>
        <div className="o-grid__item u-1/1 u-1/6@tablet"></div>
        <div className='o-grid__item u-1/1  u-5/6@tablet'>
          {(!!priceInfo  && !!displayContracts)?
            (<div className='o-grid o-grid--justify-right c-list-item__contract'>
              {
                (displayContracts.slice(0,3)?.map((displayContract, index) => (
                  <div className="c-list-item__contract c-list-item__contract-content c-list-item__contract-item">
                    <input
                      type="radio"
                      className="c-list-item__contract-radio"
                      value={displayContract?.contractName}
                      id={`${materialId}_${displayContract?.contractNumber}`}
                      defaultChecked={displayContract?.contractNumber === selectedContract?.contractNumber}
                      checked={displayContract?.contractNumber === selectedContract?.contractNumber}
                      onClick={() => setSelectedContract(displayContract)}
                    />
                    <label htmlFor={`${materialId}_${displayContract?.contractNumber}`}
                           className="c-list-item__contract-label">

                      <span className="c-list-item__contract-label-price">{getDisplayPrice(displayContract?.webPrice, locale, currency)}</span>
                      &nbsp;-&nbsp;
                      <Tooltip
                        className="c-list-item__contract-tooltip"
                        content={displayContract?.abbreviation || displayContract?.contractName}
                        position="top"
                      >
                        <span className="c-list-item__contract-label-name">{displayContract?.abbreviation || displayContract?.contractName}</span>
                      </Tooltip>
                      &nbsp;&nbsp;
                      {index === 0 && <span>{t('Best price')}</span>}
                    </label>
                  </div>)
                ))
              }
              {!isShowMore ?
                (displayContracts.slice(3, displayContracts?.length)?.map((displayContract) => (
                  <div className="c-list-item__contract c-list-item__contract-content c-list-item__contract-item">
                    <input
                      type="radio"
                      className='c-list-item__contract-radio'
                      value={displayContract?.contractName}
                      id={`${materialId}_${displayContract?.contractNumber}`}
                      defaultChecked={displayContract?.contractNumber === selectedContract?.contractNumber}
                      checked={displayContract?.contractNumber === selectedContract?.contractNumber}
                      onClick={()=>setSelectedContract(displayContract)} 
                    />
                    <label htmlFor={`${materialId}_${displayContract?.contractNumber}`} className='c-list-item__contract-label'>
                      <span>{getDisplayPrice(displayContract?.webPrice, locale, currency)}</span>
                      &nbsp;-&nbsp;
                      <Tooltip
                        className="c-list-item__contract-tooltip"
                        content={displayContract?.abbreviation || displayContract?.contractName}
                        position="top"
                      >
                        <span className='c-list-item__contract-label-name'>{displayContract?.abbreviation || displayContract?.contractName}</span>
                      </Tooltip>
                      &nbsp;&nbsp;
                    </label>
                  </div>)
                )): ''
              }
              {showIcon && (
                <div className='c-list-item__contract-show-more'>
                  <Button
                      className=""
                      color="inline-link"
                      size="small"
                      icon={isShowMore ? 'arrow-down' : 'arrow-up'}
                      onClick={()=>setIsShowMore(!isShowMore)}
                      >
                      {isShowMore ? t('Show more') : t('Show less')}
                  </Button>
                </div>
              )}
              </div>)
            :null
          }
          {
            !isOnMobile && isContractLoading && (
              <div className='o-grid c-list-item__contract c-list-item__contract-content-fix o-grid--center'>
                <div className='u-text-bold c-cart-actions__contract-name u-margin-bot-tiny'>
                  {t(CONTRACT_LOADING_MESSAGE)}
                </div>&nbsp;
                <div className='c-list-item__contract-loading-icon'><Loading /></div>
              </div>
          )}
          {
            !isOnMobile && isContractTimedOut && (
              <div className='o-grid c-list-item__contract c-list-item__contract-content-fix o-grid--center'>
                <div className='u-text-bold c-cart-actions__contract-name u-margin-bot-tiny'>
                  {t(CONTRACT_TIMED_OUT_MESSAGE)}
                </div>
              </div>
          )}
        </div>
      </>}
      {grid && !!priceInfo && (
        <div className='c-list-item__contract c-list-item__contract-dropdown'>
        <Field
          fieldComponent={'Select'}
          fullWidth
          handleChange={(e) => setCurrentContractFromSelection(Array.from(e.target.selectedOptions)[0].id)}
          name={"contractSelection"}
          options={contractOptions}
          renderer={contractRenderer}
          initialSelection={selectedContract?.contractNumber}
          value={selectedContract?.contractNumber}
        />
        </div>
      )}
    </div>
  )
}

export default connectToLocale(ContractSelection)

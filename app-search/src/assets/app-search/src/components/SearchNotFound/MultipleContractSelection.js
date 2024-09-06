import React, { useState } from "react";
import cn from 'classnames'
import {
  Currency,
  Loading,
  Field,
  currencyFormat,
} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import {CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE} from "../../constants";

const MultipleContractSelection = ({
                                     selectedContract,
                                     setSelectedContract,
                                     isContractLoading,
                                     isContractTimedOut,
                                     contract,
                                     currency,
                                     trimmedDescriptions,
                                     priceInfo,
                                     locale }) => {
  const displayContracts = (!!priceInfo?.additionalPrices) ? priceInfo?.additionalPrices : [priceInfo]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedContractName = selectedContract?.abbreviation || selectedContract?.contractName || contract?.contractName
  const isBestPriceContractTrimmed = selectedIndex === 0 && selectedContractName?.length > 35
  const getDisplayPrice = (webPrice, locale, currency) => {
    const { value } = currencyFormat(webPrice, locale, currency);
    return value
  }
  let contractOptions = []
  if (!!priceInfo) {
    displayContracts?.map((displayContract, index) => {
      contractOptions.push({
        id: displayContract?.contractNumber,
        text: index === 0 ?
          `${displayContract?.contractName} Best price`
          : (!!displayContract.abbreviation) ?
            `${getDisplayPrice(displayContract?.webPrice, locale, currency)} - ${displayContract?.abbreviation}`
            : `${getDisplayPrice(displayContract?.webPrice, locale, currency)} - ${displayContract?.contractName}`
      })
    })
  }
  const contractRenderer = (options, initialSelection) => (
    options.map(option => (
      <option id={option?.id} key={option?.id} value={option?.id}>
        {option.text}
      </option>
    )
    )
  )

  const setCurrentContractFromSelection = (selectedId, index) => {
    const result = priceInfo?.additionalPrices?.find(contract => Number(contract?.contractNumber) === Number(selectedId));
    setSelectedContract(result)
    setSelectedIndex(index)
  }


  return (
    <div>
      <div className='c-search-not-found__selected-contract-section'>
        {isContractLoading &&
          <div className='o-grid o-grid--center c-search-not-found__selected-contract-name'>
            {t(CONTRACT_LOADING_MESSAGE)}
            &nbsp;
            <Loading/>
          </div>
        }
        {isContractTimedOut &&
          <span className='c-search-not-found__selected-contract-name'>{t(CONTRACT_TIMED_OUT_MESSAGE)}</span>
        }
        {!!selectedContract && (
          <>
            <div className="c-search-not-found__contractSelectedNameSection">
              <div className='c-search-not-found__selected-contract-name'>
                {trimmedDescriptions(selectedContractName, isBestPriceContractTrimmed ? 26 : 30)}
                { /*  The first index is considered to be best price in case of multiple contracts */}
                {
                  selectedIndex == 0 ? 
                    <span className={cn("c-search-not-found__bestPrice", { "alignBestPriceForLongContract": isBestPriceContractTrimmed })}>
                      {t('Best Price')}
                    </span> : null
                }
              </div>
              
              
            </div>
            <Currency
              value={selectedContract?.webPrice}
              currencyCode={currency || selectedContract?.currency}
              className='c-search-not-found__selected-contract-price'
            />
          </>
        )}
      </div>
      {!!priceInfo && (
        <div className='c-search-not-found__contract c-search-not-found__contract-dropdown'>
          <Field
            fieldComponent={'Select'}
            fullWidth
            handleChange={(e) => setCurrentContractFromSelection((Array.from(e.target.selectedOptions)[0].id), e.target.selectedIndex)}
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

export default MultipleContractSelection

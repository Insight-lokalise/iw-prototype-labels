import React, { useRef, useState } from "react";
import { currencyFormat, Tooltip } from '@insight/toolkit-react'
import {isMobile } from '@insight/toolkit-utils'
const IPSContractOption = ({ 
    selectedContract,
    setSelectedContract,
    contract,
    locale,
    index
}) => {
    const {
        currency,
        webPrice,
        contractNumber,
        contractName,
        abbreviation
    } = contract
    const optionContainer = useRef(null)
    const [isOnMobile, setIsOnMobile] = useState(isMobile())

    const { value } = currencyFormat(
        webPrice, locale, currency
    )
    const labelName = abbreviation || contractName
    const isOpenMarketEnabled = Insight?.userPermissions?.includes('fed_open_market') || false;
    const isBestPriceEnabled = isOpenMarketEnabled || contractName !== 'Open Market';
    const renderContractOptionDesktop = () => {
        const renderContractLabel = () => { 
            return (
                <>
                    <span className="c-product-specifications__pricing__contracts__list-price">{value} - &nbsp;</span>
                    <Tooltip
                      className="c-product-specifications__pricing__contracts__list-tooltip"
                      content={labelName}
                      position="top"
                    >
                      <span className="c-product-specifications__pricing__contracts__list-name">{labelName}</span>
                    </Tooltip>
                    {isBestPriceEnabled && index === 0 && <span className="c-product-specifications__pricing__contracts__list-best-price">Best price</span>}
                </>
            )
        }
        return (
            <div className="o-grid o-grid--top" ref={optionContainer}>
                <input
                    type="radio"
                    id={contractNumber || 0}
                    defaultChecked={contractNumber === selectedContract.contractNumber}
                    checked={contractNumber === selectedContract.contractNumber}
                    name={contractName}
                    onChange={() => setSelectedContract(contract)}
                />
                <label htmlFor={contractNumber || 0}>
                    {renderContractLabel(contractName)}
                </label>
            </div>
        )
    }
    const renderContractOptionMobile = () => {
        const renderContractLabel = selectedContract.contractNumber !== contractNumber ? `${value} - ${labelName}` : `${labelName}`
        return (
            <option value={contractNumber}>
                {renderContractLabel}
            </option>
        )
    }
    return (
        <>
            {isOnMobile ? renderContractOptionMobile() : renderContractOptionDesktop()}
        </>
    )
}

export default IPSContractOption

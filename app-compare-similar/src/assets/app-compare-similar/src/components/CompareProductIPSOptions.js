import React from "react";
import { currencyFormat } from "@insight/toolkit-react";
const CompareProductIPSOptions = ({options, setSelectedContract, selectedContract, locale, isLoggedIn, isIPSUser, isStockAndPriceDisabled}) => {
    const isOpenMarketEnabled = (isLoggedIn && isIPSUser) ? Insight?.userPermissions?.includes('fed_open_market') : false
    if(!options){
        return null
    }
    const contractOptions = () => {
        const filteredContracts = isOpenMarketEnabled ? options : options.filter(o => o.contractName !== 'Open Market')
        return filteredContracts?.map(option => {
            const {
                webPrice,
                currency,
                contractNumber,
                abbreviation,
                contractName
            } = option
            const { value } = currencyFormat(
                webPrice, locale, currency
            )
            const contractPrice = (selectedContract?.contractNumber === contractNumber || isStockAndPriceDisabled) ? null : value + ' - '
            return <option value={contractNumber || contractName}>
                {contractPrice} {abbreviation || contractName}
            </option>
        })
    }
    return (
        <select 
            value={selectedContract?.contractNumber || selectedContract?.contractName}
            onChange={(e) => {
                setSelectedContract(options.filter((o) => o.contractNumber === e.target.value || o.contractName === e.target.value)[0])
            }}
        >
            {contractOptions()}
        </select>
    )
}

export default CompareProductIPSOptions;
export default function transformContractsArray(contracts, contractList = []) {
 
  const newContracts = contracts.reduce((acc, contract) => {
    const contractId = typeof contract === 'object' ?  `${contract?.type}-${contract?.contractId}` : contract 
    const selected = contractList ? contractList.includes(contractId) : false
    return { ...acc, [contractId]: selected }
  }, {})  
 
  return newContracts
}

 
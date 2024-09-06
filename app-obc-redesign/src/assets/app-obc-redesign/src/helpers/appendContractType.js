
const appendContractType = (contracts) => {
      const appendedContracts = []

      contracts.map(contract => {
        const {contractId, type} = contract
        return appendedContracts.push(`${type}-${contractId}`) 
      })
      
  return appendedContracts
}

export default appendContractType
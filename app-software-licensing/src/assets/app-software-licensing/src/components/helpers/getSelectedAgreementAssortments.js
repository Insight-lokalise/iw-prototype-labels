export default function getSelectedAgreementAssortments(contractAndAssortments){
  return Object.keys(contractAndAssortments).reduce((acc, contractId, idx) => {
    if(contractAndAssortments[contractId]){
      acc.allContractIds = !acc.allContractIds ? contractId : acc.allContractIds + ',' + contractId
      acc.assortmentIds = !acc.assortmentIds ? contractAndAssortments[contractId] : acc.assortmentIds + ',' + contractAndAssortments[contractId]
    }
    return acc
  }, { assortmentIds: '', allContractIds: '' })


}

export default function generateCheckboxes(licenseAgreements) {
  const agreements = licenseAgreements.reduce((acc, manufacturer) => {
    const { checkboxes, assortIds, assortValues } = manufacturer.agreements.reduce((curr, agreement) => {
      if(agreement.active && agreement.assortments){
        acc.checkboxes[agreement.id] = false
        acc.assortIds[agreement.id] = false
        acc.assortValues[agreement.id] = agreement.assortments && Object.keys(agreement.assortments)
      }
      return curr
    }, {});
    return acc
  }, { checkboxes: {}, assortIds: {}, assortValues: {} });

  return {
    checkboxes: agreements.checkboxes,
    contractAndAssortments: agreements.assortIds,
    assortmentIds: agreements.assortValues
  }
}

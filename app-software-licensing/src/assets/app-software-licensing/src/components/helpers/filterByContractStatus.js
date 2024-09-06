export default function filterByContractStatus (licenseAgreements) {
  return licenseAgreements.reduce((acc, manufacturer) => {
    const { active, pending, expired } = manufacturer.agreements.reduce((total, agreement) => {
      let type = 'active'
      if(agreement.active){
        if(!agreement.assortments || Object.keys(agreement.assortments).length == 0){
          type = 'pending'
        }else{
          type = 'active'
        }
      }else{
        type = 'expired'
      }
      return { ...total, [type]: [...total[type], agreement] }
    }, { active: [], pending: [], expired: []});

    if (active.length > 0) {
      acc.activeContracts.push(createContractType(manufacturer, active, false))
    }
    if (pending.length > 0) {
      acc.pendingContracts.push(createContractType(manufacturer, pending, true))
    }
    if (expired.length > 0) {
      acc.expiredContracts.push(createContractType(manufacturer, expired, true))
    }

    return acc
  }, { activeContracts: [], pendingContracts: [], expiredContracts: []});
}

function createContractType(manufacturer, agreements, expiredAgreement) {
  return  {
    name: manufacturer.name,
    expiredAgreement,
    agreements
  }
}

/**
 * Check if an agreement's features need to be disabled in the UI
 *
 * @param agreement {Object} agreement object
 *
 * @returns {boolean}
 **/
export default function disableContractSelection(agreement){
  return (agreement.active && (!agreement.assortments || Object.keys(agreement.assortments).length == 0)) || !agreement.active
}
          
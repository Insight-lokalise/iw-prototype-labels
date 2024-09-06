export const selector_lineLevelSessionInfos = (state) => state.persistReducer.lineLevelSessionInfos || []

export const selector_hasSellRequirements = (state) => {
  const lineLevelItems = selector_lineLevelSessionInfos(state)
  const sellReqItems = lineLevelItems.length > 0 && lineLevelItems.filter(item => !!item.sellRequirements && item.sellRequirements.length > 0)
  return sellReqItems.length > 0
}

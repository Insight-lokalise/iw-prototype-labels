/* eslint-disable import/prefer-default-export */
export function handleShareResponse(shareResponse) {
  const { categoryMap, categoryWebGroupMap, webGroupMap } = shareResponse.data
  const hasCategories = !!categoryMap

  return hasCategories ? handleCategories() : handleWebGroups()

  function handleCategories() {
    return shareResponse.data && shareResponse.data.webGroupMap
      ? Object.keys(shareResponse.data.categoryMap).map(categoryId => {
          return {
            categoryId,
            categoryName: categoryMap[categoryId],
            id: Number(categoryWebGroupMap[categoryId]),
            name: webGroupMap[categoryWebGroupMap[categoryId]],
          }
        })
      : []
  }

  function handleWebGroups() {
    return webGroupMap
      ? Object.keys(webGroupMap).map(webGroupId => ({
          id: Number(webGroupId),
          name: webGroupMap[webGroupId],
        }))
      : []
  }
}

export function createExportAsAFileUrl({ locale, wId }) {
  return `${window.location.origin}/insightweb/cs/export/${wId}?locale=${locale}`
}

export const isProductGroup = entity => entity['@type'] === 'PRODUCT_GROUP'
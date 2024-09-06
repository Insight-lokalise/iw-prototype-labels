export function getLanguage(locale) {
  return locale.split('_')[0]
}

export function filterCategoriesByTags(categories, groups, filters, pins) {
  if(filters.length === 0) return {categories, autoExpanded: []}
  const groupIdList = filterProductGroupsByTags(groups, filters, pins).map(group => group.id)
  const filteredCategories = categories.filter(category => {
    if (filters.includes('pins') && pins.includes(category.id)) return true
    if (category.tags.some(tagId => filters.includes(tagId))) return true
    return category.order.some(groupId => groupIdList.includes(groupId))
  })
  const autoExpanded = categories.filter(category => category.order.some(groupId => groupIdList.includes(groupId))).map(cat => cat.id)
  return { categories: filteredCategories, autoExpanded}
}

export function filterProductGroupsByTags(groups, filters, pins) {
  if (filters.length === 0) return groups
  return groups.filter(group => {
    if (filters.includes('pins') && pins.includes(group.id)) return true
    return group.tags.some(tagId => filters.includes(tagId))
  })
}

export function chunkArr(array, size) {
  if (array.length <= size) {
    return [array];
  }
  return [array.slice(0, size), ...chunkArr(array.slice(size), size)];
}

export const chunkSize = () => {
  const { innerWidth: width } = window;
  switch (true) {
    case width > 1199: {
      return 4;
    }
    case width > 767: {
      return 2;
    }
    default: {
      return 1;
    }
  }
};

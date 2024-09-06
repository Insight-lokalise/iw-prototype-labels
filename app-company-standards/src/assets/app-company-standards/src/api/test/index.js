import {
  activityLog,
  categories,
  categoryOrder,
  logEntry,
  productGroups,
  productSets,
  mockMaterialIds,
  mockSettings,
  mockSearchResults,
  tags,
} from './mockData'
import axios from "../us/axiosConfig";

export function fetchActivityLog({ wId }) {
  console.log('wId:', wId)
  return Promise.resolve(activityLog)
}

export function fetchCategories() {
  console.log('fetching cats:')
  return Promise.resolve(categories)
}

export function fetchSettings({ wId }) {
  console.log('wId:', wId)
  return Promise.resolve(mockSettings)
}

export function fetchProductGroupsByCategory({ categoryId }) {
  return Promise.resolve({ productGroups })
}

export function fetchProductSetsByProductGroup({ productGroupId }) {
  return Promise.resolve({ productSets })
}

export function fetchTags() {
  return Promise.resolve(tags)
}

export function fetchSearchResults({ searchString }) {
  console.log('searchString', searchString)
  return Promise.resolve({data: mockSearchResults})
}

export function postCategory({ category, categoryId }) {
  console.log('category:', category)
  return Promise.resolve({ id: categoryId || randInt(), logEntry: logEntry('Add/Edited category') })
}

export function postDuplicate({ id, parentId, type, unlink, wId }) {
  console.log(id, parentId, type, unlink, wId)
  return Promise.resolve(logEntry(`Duplicated ${id} of type ${type} to ${wId || 'self'}, unlink = ${unlink}`))
}

export function postProductGroup({ productGroup, productGroupId, categoryId }) {
  console.log('productGroup:', productGroup)
  console.log('categoryId:', categoryId)
  return Promise.resolve({ id: productGroupId || randInt(), logEntry: logEntry('Add/Edited product group') })
}

export function postProductSet({ productSet, productSetId, productGroupId }) {
  console.log('productSet:', productSet)
  console.log('productGroupId:', productGroupId)
  return Promise.resolve({ id: productSetId || randInt(), logEntry: logEntry('Add/Edited product set') })
}

export function putSettings({ settings }) {
  console.log('settings:', settings)
  return Promise.resolve({ logEntry: logEntry('Edited settings') })
}

export function postShare({ id, parentId, wId }) {
  console.log('parentId:', parentId)
  return Promise.resolve(logEntry(`Shared ${id} with ${wId}`))
}

export function postTag({ tag, tagId }) {
  console.log('tag:', tag)
  return Promise.resolve({ id: tagId || randInt(), logEntry: logEntry('Add/Edited tag') })
}

export function deleteCategory({ categoryId }) {
  return Promise.resolve({ id: categoryId || randInt(), logEntry: logEntry('Deleted category') })
}

export function deleteProductGroup({ productGroupId, categoryId }) {
  console.log('categoryId:', categoryId)
  return Promise.resolve({ id: productGroupId || randInt(), logEntry: logEntry('Deleted product group') })
}

export function deleteProductSet({ productSetId, productGroupId }) {
  console.log('productGroupId:', productGroupId)
  return Promise.resolve({ id: productSetId || randInt(), logEntry: logEntry('Deleted product set') })
}

export function reorderCategories({ order }) {
  console.log('categoryOrder:', order)
  return Promise.resolve(logEntry('Reordered categories'))
}

export function reorderProductGroups({ order, categoryId }) {
  console.log('categoryId:', categoryId)
  console.log('productGroupOrder:', order)
  return Promise.resolve(logEntry('Reordered product groups'))
}

export function reorderProductSets({ order, productGroupId }) {
  console.log('productGroupId:', productGroupId)
  console.log('productSetOrder:', order)
  return Promise.resolve(logEntry('Reordered product sets'))
}

export function getWebGroup({ webGroupId }) {
  console.log('webGroupId:', webGroupId)
  return Promise.resolve({ data: { id: webGroupId, name: 'Sample web group' }})
}

export function getDuplicateExportFile(path) {
  console.log('path:', path)
  return Promise.resolve()
}

export function duplicateStandards({ parentId, targetId }) {
  console.log('parentId:', parentId)
  console.log('targetId:', targetId)
  return Promise.resolve({ filePath: 'cs/exportFile', invalidParts: mockMaterialIds})
}

function filterByParent(parentId, parentArray, childArray) {
  const { order } = parentArray.find(entry => entry.id === parentId)
  const groups = order.map(childId => childArray.find(entry => entry.id === childId))
  return groups
}

function randInt() {
  return Math.floor(Math.random() * 1000000)
}

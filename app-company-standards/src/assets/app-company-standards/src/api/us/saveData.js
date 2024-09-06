import axios, { POST } from './axiosConfig'
import { t } from '@insight/toolkit-utils'
import { handleShareResponse, isProductGroup } from './helpers'
import { MESSAGE_TYPES } from "../../components/UniversalMessages"

const TYPES = {
  CATEGORY: { '@type': 'CATEGORY' },
  PRODUCT_GROUP: { '@type': 'PRODUCT_GROUP' },
  PRODUCT_SET: { '@type': 'PRODUCT_SET' },
}

const DUPE_TYPES = {
  'categories': 'category',
  'productGroups': 'product group',
  'productSets': 'product set',
}

export function checkAttachmentAlbum({ data, wId }) {
  return axios({
    method: POST,
    url: `cs/attachments/${wId}/reference`,
    data,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to verify attachment`, error)
    })
}
export function duplicateStandards({ destinationId, sourceId }) {
  return axios({
    method: POST,
    url: `cs/catalog/duplicate`,
    data: { destinationId, sourceId },
  })
    .then(res => res.status)
    .catch(error => {
      console.warn(`Failed to duplicate`, error)
      throw error
    })
}

export function postCategory({ category, wId, messenger }) {
  return axios({
    method: POST,
    url: 'cs/categories',
    data: { ...TYPES.CATEGORY, ...category },
    params: { wId },
  })
    .then(res => {
      messenger({ text: t('The category was successfully created.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to create category`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to save category has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function putCategory({ category, categoryId, wId, messenger }) {
  return axios({
    method: POST,
    url: `cs/categories/${categoryId}`,
    data: { '@type': 'CATEGORY', ...category },
    params: { wId },
  })
    .then(res => {
      messenger({ text: t('The category was successfully updated.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to update category`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to update category has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function postDuplicate({ type, formData, messenger }) {
  return axios({
    method: POST,
    url: `cs/${type}/duplicate`,
    data: formData,
  })
    .then(res => {
      messenger({ text: t(`The ${DUPE_TYPES[type]} was successfully duplicated.`), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      messenger({ text: t(`Failed to duplicate the ${DUPE_TYPES[type]}.`), type: MESSAGE_TYPES.ERROR })
      console.warn(`Failed to duplicate`, error)
      throw error
    })
}

export function putPublish(params) {
  return axios({
    method: POST,
    url: `cs/catalog/publish`,
    params,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to `, error)
      throw error
    })
}

export function putPublishAll({ wId, messenger }) {
  return axios({
    method: POST,
    url: `cs/catalog/publish-all?wgId=${wId}`,
  })
    .then(res => {
      messenger({ text: t('This action was completed successfully'), type: MESSAGE_TYPES.SUCCESS })
      return res.status
    })
    .catch(error => {
      messenger({ text: t('This action failed'), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function postProductGroup({ categoryId, productGroup, messenger }) {
  return axios({
    method: POST,
    url: `cs/productGroups`,
    data: { ...TYPES.PRODUCT_GROUP, ...productGroup },
    params: { categoryId },
  })
    .then(res => {
      messenger({ text: t('The product group was successfully created.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to create product group`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to save product group has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function putProductGroup({ productGroup, productGroupId, messenger }) {
  return axios({
    method: POST,
    url: `cs/productGroups/${productGroupId}`,
    data: { ...TYPES.PRODUCT_GROUP, ...productGroup },
  })
    .then(res => {
      messenger({ text: t('The product group was successfully updated.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to update product group`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to update product group has failed.'
      messenger({text: t(text)})
      throw error
    })
}

export function postProductSet({ productGroupId, productSet, messenger, locale }) {
  return axios({
    method: POST,
    url: `cs/productSets`,
    data: { ...TYPES.PRODUCT_SET, ...productSet },
    params: { productGroupId, locale },
  })
    .then(res => {
      messenger({ text: t('The product set was successfully created.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to create product set`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to save product set has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function putProductSet({ productSet, productSetId, messenger, locale }) {
  return axios({
    method: POST,
    url: `cs/productSets/${productSetId}`,
    data: { ...TYPES.PRODUCT_SET, ...productSet },
    params: { locale }
  })
    .then(res => {
      messenger({ text: t('The product set was successfully updated.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to update product group`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to update product set has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function putProductList({ items, locale, productSetId, wId, messenger }) {
  return axios({
    method: POST,
    url: `cs/updateItems`,
    data: { items, locale, productSetId },
    params: { wId },
  })
    .then(res => {
      messenger({ text: t('Product list successfully updated.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to update products`, error)
      const text = error.response && error.response.data && error.response.data.message || 'Attempt to save product list has failed.'
      messenger({ text: t(text), type: MESSAGE_TYPES.ERROR })
      throw error
    })
}

export function putSettings({ settings, wId, messenger }) {
  return axios({
    method: POST,
    url: `cs/settings`,
    data: settings,
    params: { wId },
  })
    .then(res => {
      messenger({ text: t('Settings successfully updated.'), type: MESSAGE_TYPES.SUCCESS })
      return res.data
    })
    .catch(error => {
      console.warn(`Failed to save settings`, error)
      throw error
    })
}

export function share({ sharedToEntity, sharedEntity }) {
  const url = isProductGroup(sharedEntity) ? `cs/productGroups/share` : `cs/categories/share`
  const sharedEntityId = sharedEntity.id?.toString()?.trim() ?? ""
  const sharedToEntityId = sharedToEntity?.id?.toString()?.trim() ?? "";
  return axios({
    method: POST,
    url,
    data: { parentId: sharedToEntityId, targetId: sharedEntityId },
  })
    .then(handleShareResponse)
    .catch(error => {
      console.warn(`Failed to share`, error)
      throw error
    })
}

export function unshare({ unsharedToEntity, unsharedEntity }) {
  const isPG = isProductGroup(unsharedEntity)

  const url = isPG ? `cs/productGroups/unshare` : `cs/categories/unshare`
  return axios({
    method: POST,
    url,
    data: { parentId: isPG ? unsharedToEntity.categoryId : unsharedToEntity.id, targetId: unsharedEntity.id },
  })
    .then(handleShareResponse)
    .catch(error => {
      console.warn(`Failed to unshare`, error)
      throw error
    })
}

export function unlink({ destinationId, sourceId, isProductGroup}) {
  const url = isProductGroup ? `cs/productGroups/unlink` : `cs/categories/unlink`
  return axios({
    method: POST,
    url,
    data: { destinationId, sourceId },
  })
  .then(res => res.data)
  .catch(error => {
      console.warn(`Failed to unlink`, error)
      throw error
    })
}

export function postTag({ tag, tagId, wId }) {
  return axios({
    method: POST,
    url: `cs/tags${tagId ? `/${tagId}` : ''}`,
    params: { wId },
    data: tag,
  }).catch(error => {
    console.warn(`Failed to save tag`, error)
    throw error
  })
}

export function reorderCategories({ idOrder, wId }) {
  return axios({
    method: POST,
    url: `cs/categories/order`,
    params: { wId },
    data: idOrder,
  }).catch(error => {
    console.warn(`Failed to reorder categories`, error)
    throw error
  })
}

export function reorderProductGroups({ idOrder, categoryId }) {
  return axios({
    method: POST,
    url: `cs/productGroups/order`,
    data: idOrder,
    params: { categoryId },
  }).catch(error => {
    console.warn(`Failed to reorder product groups`, error)
    throw error
  })
}

export function reorderProductSets({ idOrder, productGroupId }) {
  return axios({
    method: POST,
    url: `cs/productSets/order`,
    data: idOrder,
    params: { productGroupId },
  }).catch(error => {
    console.warn(`Failed to reorder product sets`, error)
    throw error
  })
}

export function reorderProductItems({ idOrder, productSetId }) {
  return axios({
    method: POST,
    url: `cs/items/order`,
    data: idOrder,
    params: { productSetId },
  }).catch(error => {
    console.warn(`Failed to reorder product items`, error)
    throw error
  })
}

export function postMaterialIdsValidation(data) {
  return axios({
    method: POST,
    url: `cs/items`,
    data,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to validate and add to set`, error)
      throw error
    })
}

export function postToAttachmentAlbum({ data, psID, wId }) {
  return axios({
    method: POST,
    url: `cs/attachments/${wId}/${psID}`,
    data,
  })
    .then(res => {
       return res.data
    })
    .catch(error => {
      console.warn(`Failed to upload attachment`, error)
    })
}

export function postToImageAlbum({ data, wId }) {
  return axios({
    method: POST,
    url: `cs/images/${wId}`,
    data,
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to upload image`, error)
    })
}

export function putFindAndReplace({ searchedFor, selectedProductSets, replaceInput }) {
  return axios({
    method: POST,
    url: `cs/catalog/find-replace`,
    data: { replaceMatId: searchedFor, setIds: selectedProductSets, withNewMatId: replaceInput },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to validate and add to set`, error)
      throw error
    })
}

export function postBulkUpload({ data, locale, productSetId }) {
  return axios({
    method: POST,
    url: `cs/items/bulk`,
    data,
    params: { locale, productSetId },
  })
    .then(res => res.data)
    .catch(error => {
      console.warn(`Failed to bulk upload products`, error)
    })
}

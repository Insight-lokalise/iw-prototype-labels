import axios, { DELETE } from './axiosConfig'

export function deleteAttachment({ psID, wId, fileUrl }) {
  return axios({
    method: DELETE,
    url: `cs/attachments/${wId}/${psID}`,
    params: { fileUrl },
  }).catch( error => {
    console.warn(`Failed to delete attachment`, error)
    throw error
  })
}

export function deleteCategory({ categoryId, wId }) {
  return axios({
    method: DELETE,
    url: `cs/categories/${categoryId}`,
    params: { from: wId },
  }).catch(error => {
    console.warn(`Failed to delete category`, error)
    throw error
  })
}

export function deleteImage({ wId, fileUrl }) {
  return axios({
    method: DELETE,
    url: `cs/images/${wId}`,
    params: { fileUrl }
  }).catch( error => {
    console.warn(`Failed to delete image`, error)
    throw error
  })
}

export function deleteProductGroup({ categoryId, productGroupId }) {
  return axios({
    method: DELETE,
    url: `cs/productGroups/${productGroupId}`,
    params: { from: categoryId },
  }).catch(error => {
    console.warn(`Failed to delete product group`, error)
    throw error
  })
}

export function deleteProductSet({ productGroupId, productSetId }) {
  return axios({
    method: DELETE,
    url: `cs/productSets/${productSetId}`,
    params: { from: productGroupId },
  }).catch(error => {
    console.warn(`Failed to delete product set`, error)
    throw error
  })
}

export function deleteTag({ tagId }) {
  return axios({
    method: DELETE,
    url: `cs/tags/${tagId}`,
  }).catch(error => {
    console.warn(`Failed to delete tag`, error)
    throw error
  })
}

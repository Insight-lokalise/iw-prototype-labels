import { get, post, del } from '../fetch'
import 'whatwg-fetch'

/**
 * Gets the User's Cart from the server session
 * @return {Object} cart object
 */
export function fetchOrderMetaData(isSharedUser) {
    const timestamp = (new Date()).getTime()
    return get(`shoppingRequest/orderMetaData?_=${timestamp}`)
        .then((response) => {
            if (isSharedUser && window.location.pathname === '/insightweb/editLineLevelInfo') {
                response.userContact = { email: '', name: '', phone: '' }
            }
            return response
        })
        .catch((error) => {
            console.warn('Failed to fetch order metadata', error)
            throw error // re-throw error for initial testing of functionality
        })
}

export function uploadFile(file) {
    let data = new FormData()
    data.append('fileUpload', file)
    data.append('sessionObject', '')
    data.append('overwrite', false)
    data.append('folderPath', 'client_files')

    return post('cartuploadfile', data, {
        headers: {
            Accept: 'application/json, application/xml, text/plain, text/html',
        },
        isFile: true,
    })
        .catch((error) => {
            console.warn('Failed to upload file', error)
            throw error // re-throw error for initial testing of functionality
        })
}

export function deleteFile() {
    const timestamp = (new Date()).getTime()
    return del(`shoppingRequest/deleteFile?_=${timestamp}`)
        .catch((error) => {
            console.warn('Failed to delete file', error)
            throw error // re-throw error for initial testing of functionality
        })
}

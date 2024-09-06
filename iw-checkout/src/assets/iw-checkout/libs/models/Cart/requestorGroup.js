import { get } from './../fetch'

/**
 * gets the cart objext
 * @return {object} cart object
 * http://localhost/insightweb/transaction/saveRequestorGroupId?requestorGroupId=511585&requestorGroup=US256perftestgrp2&clientBrowserDate=3/13/2017&_=1489441779995
 */
export function saveRequestorGroupId(requestorGroupId, requestorGroup) {
    var now = new Date()
    var params = {
        requestorGroupId: requestorGroupId,
        requestorGroup: requestorGroup,
        clientBrowserDate: (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
        _: now.getTime(),
    }

    var url = 'transaction/saveRequestorGroupId'
    var sep = '?'
    // Add parameters to the URL.
    Object.keys(params).forEach(key => {
        url += sep + key + '=' + params[key]
        sep = '&'
    })

    return get(url)
        .catch(error => {
            console.warn('Failed to fetch cart', error)
            throw error // re-throw error for initial testing of functionality
        })
}

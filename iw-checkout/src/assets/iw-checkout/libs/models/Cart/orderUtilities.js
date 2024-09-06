/**
 * Cause the browser to download an excel-formatted document of the user's cart.
 * @return {undefined}
 */
export function exportAsXLS() {
    window.location.assign(`${window.location.origin}/insightweb/transaction/exportCart`)
}

/**
 * Broadcast a message that an item was added to the cart, which the
 * new React-based header will listen for, in order to update the item
 * count to reflect the newly added item. We should abstract out the
 * details of this communication channel into a separate library, but
 * we're not yet sure what architecture we'll use for cross-component
 * communication. It's being discussed here:
 * https://pmvscentral.atlassian.net/wiki/spaces/FD/pages/163446792
 * @param message
 */
export function updateMiniCart() {
    window.postMessage({ type: 'cart:updated' }, window.location.origin);
}

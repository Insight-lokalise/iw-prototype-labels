/* Directs user to the previous page after clicking the 'x' of the Modal. */
export default function onModalClose() {
  window.location.href = document.referrer;
}

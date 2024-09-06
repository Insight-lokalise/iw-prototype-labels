export default function isIE() {
  return (navigator.appName === 'Microsoft Internet Explorer'
    ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)))
}

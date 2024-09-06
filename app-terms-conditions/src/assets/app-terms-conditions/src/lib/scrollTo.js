import isIE from './isIE'

export default function scrollTo() {
  isIE() ? window.scrollTo( 0, 0 ) :
    window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
  return null
}

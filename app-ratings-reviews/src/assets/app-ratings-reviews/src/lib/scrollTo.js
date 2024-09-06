import isIE from './isIE'

export default function scrollTo({ top, left }) {
  isIE() ? window.scrollTo( left, top ) : window.scrollTo({
    behavior: 'smooth',
    left,
    top
  });
  return null
}

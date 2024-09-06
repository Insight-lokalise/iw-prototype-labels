import { t } from '@insight/toolkit-utils'

export function dayDifference(createdDate) {
  const difference = Date.now() - createdDate
  const days = Math.ceil(difference/1000/60/60/24)
  const dayText = `day${days === 1 ? '' : 's'}`
  return `(${days} ${t(dayText)})`
}

import { post } from '../fetch'

/**
 * Checks wether user is subscribed to marketo or not
 * @return boolean
 */
export function isSubscribedToMarketo(emailID) {
  return post('/insightweb/isSubscribedToMarketo', emailID)
      .catch((error) => {
          console.warn('Marketo API failed')
          throw error
      })
}

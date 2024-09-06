import * as User from './model/User'
import { LOAD_USER } from './types'

export function loadUser() {
  return dispatch =>
    User.loadUser().then(user => {
      dispatch({
        type: LOAD_USER,
        payload: user,
      })
    })
}

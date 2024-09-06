import { post } from '../../models/fetch'
export const validateDomain = ({ userContact }) => {
  return new Promise( (resolve, reject) => {
    post(`domainExists`, {
      userEmail: userContact.email,
    }).then((res) => {
      if (!res) resolve(false)
      resolve(true);
    }, (error) => {
      reject(error);
    })
  })
}

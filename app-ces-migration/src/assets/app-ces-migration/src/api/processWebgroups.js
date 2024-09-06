import axios from 'axios'

export function processWebgroups(data) {
  const {webGroups, userEmail, optIn, file} = data
  const isOptIn = optIn == 1
  let formData = new FormData()
  formData.append('file', file)

  return axios({
    method: 'post',
    url: `/insightweb/ces/migration`,
    data: formData,
    params: {
      webGroups: webGroups.replace(/\s/g, ""),
      userEmail,
      optIn:isOptIn
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch(error => {
      console.warn('Failed to submit webgroups for CES migration', error)
      throw error
    })
    .then(({ data }) => data)
}

export function createWebgroups({values, isWebGrp}){
  const { file } = values
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: isWebGrp ? `/insightweb/ces/createWebGroups` : `/insightweb/ces/createUsers`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch(error => {
    console.warn(isWebGrp ? 'Failed to create webgroups for specified soldTo`s' : 'Failed to create users/passwords for identified web groups', error)
    return error
  }).then(data => data)
}

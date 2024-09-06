import axios from 'axios'

export default function getRecIdData(client, searchTerm) {
  return axios.get(`${client}/info?term=${searchTerm}`)
  .then(({ data }) => data)
  .catch(error => console.warn(`Failed to fetch user data: ${error}`))
}
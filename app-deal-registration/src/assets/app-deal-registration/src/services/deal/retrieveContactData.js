import { getContactData } from '@api'
import populateGroup from './populateGroup'

export default async function retrieveContactData(contactNumber, groupDisplay) {
    const response = await getContactData(contactNumber.split(':')[0])
    if (response) {
        return populateGroup(response, groupDisplay)
    }
}
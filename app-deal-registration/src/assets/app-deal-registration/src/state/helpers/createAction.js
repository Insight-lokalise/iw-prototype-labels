export default function createAction(type) {
    return payload => ({
        payload,
        type
    })
}
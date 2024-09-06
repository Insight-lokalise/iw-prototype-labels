export default async function getActiveFormById(id) {
    const response = await fetch(`/dealreg/forms/active/1/formid/${id}`)
    return response.json()
}
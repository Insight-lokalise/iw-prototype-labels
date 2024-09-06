export default async function migrateForm(payload) {
    const response = await fetch('/migrateForm', {
        body: JSON.stringify(payload).toString(),
        method: 'POST'
    })
    return response.json()
}
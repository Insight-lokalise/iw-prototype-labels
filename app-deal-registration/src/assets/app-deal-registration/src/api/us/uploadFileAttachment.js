export default async function uploadFileAttachment(files) {
	const promises = files.map(async file => {
		const data = new FormData()
		data.append('fileUpload', file.file)
		data.append('sessionObject', '')
		data.append('folderPath', 'deal_reg')

		const response = await fetch('/dealreg/file/upload', {
			body: data,
			credentials: 'include',
			method: 'POST',
			mode: 'no-cors'
		})
		return response.text()
	})

	return Promise.all(promises)
}

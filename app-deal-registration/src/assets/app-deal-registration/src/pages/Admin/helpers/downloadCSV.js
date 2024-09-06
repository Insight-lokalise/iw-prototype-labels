export default function downloadCSV(data) {
	if (!data.length) {
		return null
	}

	let result = ''
	const keys = Object.keys(data[0])

	result += keys.join(',')
	result += '\n'

	data.forEach(item => {
		let ctr = 0
		keys.forEach(key => {
			if (ctr > 0) {
				result += ','
			}
			result += item[key]
			ctr++
		})
		result += '\n'
	})

	/*
	const head = columns.reduce((acc, column) => {
		return column.download
			? `${acc}"${column.text}",`
			: acc
	}, '').slice(0, -1) + '\r\n'

	const body = data
		.reduce((acc, row) => {
			let rowString = ''
			Object.keys(row).forEach((key, idx) => {
				if (columns[idx].download) {
					rowString += `"--${row[key]}--"`
				}
			})
			acc += `"${rowString}"\r\n`
			return acc
		}, '')
		.trim()
		

	console.log(body)
	const csv = `${head}${body}`
	console.log(csv)
	*/
	const blob = new Blob([result], { type: 'text/csv' })

	if (navigator && navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, 'deal.csv')
	} else {
		const dataURI = `data:text/csv;charset=utf-8,${result}`
		const URL = window.URL || window.webkitURL
		const downloadURI = typeof URL.createObjectURL === 'undefined'
			? dataURI
			: URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.setAttribute('href', downloadURI)
		link.setAttribute('download', 'deal.csv')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}
}

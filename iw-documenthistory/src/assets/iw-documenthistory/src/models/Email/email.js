export function sendEmail(options) {
  const emailOptions = Object.assign({}, options, {
    html: true,
    attachment: 'false',
  })
  if (options.to) {
    return fetch(options.sendEmailURL, {
      headers: new Headers({ 'Content-Type': 'application/json; charset=utf-8' }),
      method: 'POST',
      body: JSON.stringify(emailOptions),
    })
  }
}

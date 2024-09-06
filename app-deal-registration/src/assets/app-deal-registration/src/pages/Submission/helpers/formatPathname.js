export default function formatPathname({ pathname }, purpose) {
  const urlParams = pathname.split('/submission/')[1]
  return getArgsForEntry(getEntryFromPath(urlParams, purpose))
}

function getEntryFromPath(entry, { currentUser } ) {
  const urlParams = entry.split('&')
  const entrypoint = urlParams.length > 1 ? 'clientlink' : 'local'
  return { entrypoint, params: urlParams, currentUser }
}

function getArgsForEntry({ entrypoint, params, currentUser }) {
  const paramsArgs = entrypoint === 'local' ? params[0].split('/') : params
  const name = currentUser ? currentUser.name : ''
  let paramsMap;

  if (entrypoint === 'clientlink') {
    paramsMap = paramsArgs.reduce((acc, curr) => {
      const [key, value] = curr.split('=')
      return { ...acc, [key]: value }
    }, { name })

  } else if (entrypoint === 'local') {
    paramsMap = paramsArgs[0]
  }
  return { entrypoint, pathArgs: paramsMap, currentUser }
}

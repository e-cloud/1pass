export function parseQuery(qstr) {
  const query = {}
  const target = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&')
  for (let i = 0; i < target.length; i++) {
    let b = target[i].split('=')
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
  }
  return query
}

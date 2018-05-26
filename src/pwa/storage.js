const saltId = 'onepass.salt'
const itCountId = 'onepass.itCount'
const passOutLenId = 'onepass.passOutLen'
const charsetId = 'onepass.charset'
const confirmId = 'onepass.user-confirm'

export function saveSalt(salt) {
  localStorage.setItem(saltId, salt)
}

export function checkIfPermissionAsked() {
  return !!JSON.parse(localStorage.getItem(confirmId))
}

export function confirmPermission() {
  localStorage.setItem(confirmId, true)
}

export function clearCache() {
  localStorage.clear()
}

export function recoverFromStorage(state) {
  const salt = localStorage.getItem(saltId)
  const itCount = localStorage.getItem(itCountId)
  const charset = localStorage.getItem(charsetId)
  const passOutLen = localStorage.getItem(passOutLenId)
  const hasConfirm = checkIfPermissionAsked()
  state.salt = salt || state.salt
  state.itCount = itCount || state.itCount
  state.charset = charset || state.charset
  state.passOutLen = passOutLen || state.passOutLen
  state.confirmStorage = hasConfirm
}

export function saveAllToStorage(state) {
  localStorage.setItem(saltId, state.salt)
  localStorage.setItem(itCountId, state.itCount)
  localStorage.setItem(charsetId, state.charset)
  localStorage.setItem(passOutLenId, state.passOutLen)
}

import * as view from '../mvo/view'
import * as storage from './storage'

const $ = view.$

export function init(state) {
  const div = $('#onepass-wrapper')

  bindEventHandlers(div, state)
}

function bindEventHandlers(context, state) {
  $('#onePass').addEventListener('submit', function () {
    const currentSalt = $('#salt').value
    if (currentSalt !== state.salt) {
      if (!state.confirmStorage) {
        const hasConfirm = window.confirm('Salt change is detected. Do you want to cache it?\n\nNote: You can clear the cache via the reset button at right-top corner.')
        if (!hasConfirm) {
          return
        }
        state.confirmStorage = true
        storage.confirmPermission()
      }
      state.salt = currentSalt
      storage.saveSalt(currentSalt)
    }
  })

  $('#reset').addEventListener('click', function () {
    const hasConfirm = window.confirm('Are you sure to clear the cache?')
    if (!hasConfirm) {
      return
    }
    storage.clearCache()
    state.confirmStorage = false
  })
}

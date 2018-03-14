import * as view from './view'

export function init(state) {
  view.init(state)
}

export function initMobile(state) {
  state.passOutLen = parseInt(state.passOutLen)
  view.initMobile(state)
}

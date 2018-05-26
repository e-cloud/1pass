import model from '../mvo/model'
import * as octopus from '../mvo/octopus'
import * as storage from './storage'
import * as viewAddon from './view-addon'
import { parseQuery } from '../lib/parse-query'

const queryState = parseQuery(location.search)
const isValidState = Object.keys(queryState).length === 4

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => { console.log('Service Worker Registered') })
}

let state = model
if (isValidState) {
  state = isValidState ? { ...model, ...queryState } : state
  storage.saveAllToStorage(state)
} else {
  storage.recoverFromStorage(state)
}

octopus.initMobile(state)
viewAddon.init(state)

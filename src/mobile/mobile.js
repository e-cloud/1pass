/* eslint-disable radix, no-plusplus */
import model from '../mvo/model'
import * as octopus from '../mvo/octopus'

function parseQuery(qstr) {
  const query = {}
  const target = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&')
  for (let i = 0; i < target.length; i++) {
    let b = target[i].split('=')
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
  }
  return query
}

const queryState = parseQuery(location.search)
const isValidState = Object.keys(queryState).length === 4
octopus.initMobile(isValidState ? Object.assign(model, queryState) : model)

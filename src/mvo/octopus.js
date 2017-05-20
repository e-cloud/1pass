/* eslint-disable radix, no-plusplus */
import JsSHA from 'jssha/src/sha3'
import BaseN from '../lib/BaseN'
import { generateAlphabet } from '../lib/BaseNHelpers'
import * as view from './view'

export function init(state) {
  view.init(state)
}

export function initMobile(state) {
  state.passOutLen = parseInt(state.passOutLen)
  view.initMobile(state)
}

function getHMAC(hashedKey, info) {
  const sha3Hmac = new JsSHA('SHA3-512', 'TEXT')
  sha3Hmac.setHMACKey(hashedKey, 'TEXT')

  sha3Hmac.update(`${info.domain$}-${info.username$}_${info.salt$}`)

  return sha3Hmac.getHMAC('HEX')
}

function hash(info) {
  const sha3 = new JsSHA('SHA3-512', 'TEXT', { numRounds: info.itCount$ })
  sha3.update(info.password$)
  return sha3.getHash('HEX')
}

function mapKeyToCharset(pwd, len, charset) {
  const key = new BaseN(generateAlphabet(charset)).encodeString(pwd)

  if (key.length < len) {
    window.alert('出问题了，请联系作者:)')
  }

  return key.slice(0, len)
}

export function generate(info) {
  const hashedKey = hash(info)
  const hmac = getHMAC(hashedKey, info)
  return mapKeyToCharset(hmac, info.passOutLen$, info.charset$)
}

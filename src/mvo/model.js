export default {
  version: PKG_VERSION,
  domain: '',
  passLenRange: new Array(123).fill(0).map((v, k) => k + 6),
  passOutLen: 16,
  charset: 94,
  itCount: 100,
  salt: 'I am a dummy salt. Don\'t use me.'
}

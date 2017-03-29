export const alphabets = {};

alphabets['32'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
alphabets['62'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
alphabets['64'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
alphabets['85'] = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu';
alphabets['91'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';

export const twoInPowerN = [];

for (let i = 0; i < 8; i++) {
  twoInPowerN[i] = (2 ** (i + 1) - 1);
}

/**
 *
 * @param {number} blockCharsCount
 * @param {number} alphabetLen
 */
export function preparePowN(alphabetLen, blockCharsCount) {
  const powN = [];
  for (let i = 0, pow = 1; i < blockCharsCount; i++, pow *= alphabetLen) {
    powN[i] = pow;
  }

  return powN;
}

/**
 *
 * @param {number} charsCount
 * @param {number} maxBitsCount
 * @param {number} radix
 */
export function getOptimalBitsCount(charsCount, maxBitsCount, radix = 2) {
  let bitsCount = 0;
  let charsCountInBits = 0;
  const n1 = logBaseN(charsCount, radix);
  const charsCountLog = Math.log(radix) / Math.log(charsCount);
  let maxRatio = 0;

  for (let n = n1; n <= maxBitsCount; n++) {
    const l1 = Math.ceil(n * charsCountLog);
    const ratio = n / l1;

    if (ratio > maxRatio) {
      maxRatio = ratio;
      bitsCount = n;
      charsCountInBits = l1;
    }
  }

  return {
    bitsCount,
    charsCountInBits
  };
}

/**
 *
 * @param {number} value
 * @param {number} radix
 */
export function logBaseN(value, radix) {
  return Math.floor(Math.log(value) / Math.log(radix));
}

/**
 *
 * @param {string} str
 */
export function strToUtf8Bytes(str) {
  const utf8 = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    }
  }
  return utf8;
}

/**
 *
 * @param {number[]} bytes
 */
export function bytesToUtf8Str(bytes) {
  let i;
  let c;
  let char2;
  let char3;

  let out = '';
  const len = bytes.length;
  i = 0;
  while (i < len) {
    c = bytes[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = bytes[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = bytes[i++];
        char3 = bytes[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
      default:
        break;
    }
  }

  return out;
}

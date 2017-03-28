/* eslint no-bitwise: 0, no-plusplus: 0 */

/**
 * source from https://github.com/KvanTTT/BaseNcoding
 */

const alphabets = {};

alphabets['32'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
alphabets['62'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
alphabets['64'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
alphabets['85'] = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu';
alphabets['91'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';

const twoInPowerN = [];
for (let i = 0; i < 8; i++) {
  twoInPowerN[i] = (2 ** (i + 1) - 1);
}

/**
 *
 * @param alphabet 字母表
 * @param blockMaxBitsCount 最大分区位数
 * @constructor
 */
class BaseN {
  constructor(alphabet, blockMaxBitsCount = 64) {
    this.alphabet = alphabet;

    // 字母表长度
    this.alphabetLen = alphabet.length;
    this.blockMaxBitsCount = blockMaxBitsCount;
    const bitsCharsCount = getOptimalBitsCount(this.alphabetLen, this.blockMaxBitsCount, 2);

    // 分区位数
    this.blockBitsCount = bitsCharsCount.bitsCount;

    // 分区编码字符数
    this.blockCharsCount = bitsCharsCount.charsCountInBits;

    this.powN = preparePowN(this.alphabetLen, this.blockCharsCount);

    // turn the alphabet in id:char to char:id
    this.inverseAlphabet = {};
    for (let i = 0; i < this.alphabetLen; i++) {
      this.inverseAlphabet[this.alphabet[i]] = i;
    }
  }

  /**
   *
   * @param {string} str
   */
  encodeString(str) {
    return this.encodeBytes(strToUtf8Bytes(str));
  }

  /**
   *
   * @param {number[]} data
   */
  encodeBytes(data) {
    if (!data || data.length === 0) return '';

    const blockBitsCount = this.blockBitsCount;
    const blockCharsCount = this.blockCharsCount;

    const mainBitsLength = Math.floor(data.length * 8 / blockBitsCount) * blockBitsCount;
    const tailBitsLength = data.length * 8 - mainBitsLength;
    const mainCharsCount = Math.floor(mainBitsLength * blockCharsCount / blockBitsCount);
    const tailCharsCount = Math.floor((tailBitsLength * blockCharsCount + blockBitsCount - 1) / blockBitsCount);
    const iterCount = Math.floor(mainCharsCount / blockCharsCount);

    const result = [];

    for (let i = 0; i < iterCount; i++) {
      this.encodeBlock(data, result, i, blockBitsCount, blockCharsCount);
    }
    if (tailBitsLength !== 0) {
      const bits = getBitsN(data, mainBitsLength, tailBitsLength);
      this.bitsToChars(result, mainCharsCount, tailCharsCount, bits);
    }

    return result.join('');
  }

  /**
   *
   * @param {number[]} src
   * @param {number[]} dst
   * @param {numer} index
   * @param {numer} blockBitsCount
   * @param {numer} blockCharsCount
   */
  encodeBlock(src, dst, index, blockBitsCount, blockCharsCount) {
    const charInd = index * blockCharsCount;
    const bitInd = index * blockBitsCount;
    const bits = getBitsN(src, bitInd, blockBitsCount);
    this.bitsToChars(dst, charInd, blockCharsCount, bits);
  }

  /**
   *
   * @param {sting[]} chars
   * @param {numer} index
   * @param {numer} count
   * @param {numer} initBlock
   */
  bitsToChars(chars, index, count, initBlock) {
    let block = initBlock;
    for (let i = 0; i < count; i++) {
      chars[index + i] = this.alphabet[block % this.alphabetLen];
      block = Math.floor(block / this.alphabetLen);
    }
  }

  decodeToString(str) {
    return bytesToUtf8Str(this.decodeToBytes(str));
  }

  decodeToBytes(data) {
    if (!data || data.length === 0) return [];

    const blockBitsCount = this.blockBitsCount;
    const blockCharsCount = this.blockCharsCount;

    let globalBitsLength = Math.floor((Math.floor((data.length - 1) * blockBitsCount / blockCharsCount) + 8) / 8) * 8;
    let mainBitsLength = Math.floor(globalBitsLength / blockBitsCount) * blockBitsCount;
    let tailBitsLength = globalBitsLength - mainBitsLength;
    let mainCharsCount = Math.floor(mainBitsLength * blockCharsCount / blockBitsCount);
    let tailCharsCount = Math.floor((tailBitsLength * blockCharsCount + blockBitsCount - 1) / blockBitsCount);
    const tailBits = this.charsToBits(data, mainCharsCount, tailCharsCount);
    if (tailBitsLength >= 32 ? 0 : tailBits >> tailBitsLength !== 0) {
      globalBitsLength += 8;
      mainBitsLength = Math.floor(globalBitsLength / blockBitsCount) * blockBitsCount;
      tailBitsLength = globalBitsLength - mainBitsLength;
      mainCharsCount = Math.floor(mainBitsLength * blockCharsCount / blockBitsCount);
      tailCharsCount = Math.floor((tailBitsLength * blockCharsCount + blockBitsCount - 1) / blockBitsCount);
    }
    const iterCount = Math.floor(mainCharsCount / blockCharsCount);

    const result = [];
    for (let i = 0; i < iterCount; i++) {
      this.decodeBlock(data, result, i, blockBitsCount, blockCharsCount);
    }
    if (tailCharsCount !== 0) {
      const bits = this.charsToBits(data, mainCharsCount, tailCharsCount);
      addBitsN(result, bits, mainBitsLength, tailBitsLength);
    }

    return result;
  }

  decodeBlock(src, dst, index, blockBitsCount, blockCharsCount) {
    const charInd = index * blockCharsCount;
    const bitInd = index * blockBitsCount;
    const bits = this.charsToBits(src, charInd, blockCharsCount);
    addBitsN(dst, bits, bitInd, blockBitsCount);
  }

  charsToBits(data, index, count) {
    let result = 0;
    for (let i = 0; i < count; i++) {
      const bigInt = this.inverseAlphabet[data[index + i]];
      result += bigInt * this.powN[i];
    }
    return result;
  }
}

function getBitsN(data, bitPos, bitsCount) {
  let result = 0;

  let curBytePos = Math.floor(bitPos / 8);
  let curBitInBytePos = bitPos % 8;
  let xLength = Math.min(bitsCount, 8 - curBitInBytePos);

  if (xLength !== 0) {
    let bigInt = data[curBytePos];
    result = ((bigInt >> 8 - xLength - curBitInBytePos) & (twoInPowerN[7 - curBitInBytePos])) << bitsCount - xLength;

    curBytePos += Math.floor((curBitInBytePos + xLength) / 8);
    curBitInBytePos = (curBitInBytePos + xLength) % 8;

    let x2Length = bitsCount - xLength;
    if (x2Length > 8) x2Length = 8;

    while (x2Length > 0) {
      xLength += x2Length;
      result |= ((data[curBytePos] >> 8 - x2Length) << bitsCount - xLength);

      curBytePos += Math.floor((curBitInBytePos + x2Length) / 8);
      curBitInBytePos = (curBitInBytePos + x2Length) % 8;

      x2Length = bitsCount - xLength;
      if (x2Length > 8) x2Length = 8;
    }
  }

  return result;
}

function addBitsN(data, value, bitPos, bitsCount) {
  let curBytePos = Math.floor(bitPos / 8);
  let curBitInBytePos = bitPos % 8;

  let xLength = Math.min(bitsCount, 8 - curBitInBytePos);
  if (xLength !== 0) {
    const rightShiftBits = bitsCount + curBitInBytePos - 8;
    // todo: here is something related to BigInteger implementation of C#
    // like `29 >> -2` is converted to `29 << 2`, but there is no such logic
    // in javascript, so here use a tenary expression
    let x1 = rightShiftBits >= 0 ? value >> rightShiftBits : value << -rightShiftBits;
    x1 &= (twoInPowerN[7 - curBitInBytePos]);
    x1 &= 0xFF;
    data[curBytePos] |= x1;

    curBytePos += Math.floor((curBitInBytePos + xLength) / 8);
    curBitInBytePos = (curBitInBytePos + xLength) % 8;

    let x2Length = bitsCount - xLength;
    if (x2Length > 8) x2Length = 8;

    while (x2Length > 0) {
      xLength += x2Length;
      const x2 = ((value >> (bitsCount - xLength)) << (8 - x2Length)) & 0xFF;
      data[curBytePos] |= x2;

      curBytePos += Math.floor((curBitInBytePos + x2Length) / 8);
      curBitInBytePos = (curBitInBytePos + x2Length) % 8;

      x2Length = bitsCount - xLength;
      if (x2Length > 8) x2Length = 8;
    }
  }
}

/**
 *
 * @param {number} blockCharsCount
 * @param {number} alphabetLen
 */
function preparePowN(alphabetLen, blockCharsCount) {
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
function getOptimalBitsCount(charsCount, maxBitsCount, radix = 2) {
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
function logBaseN(value, radix) {
  return Math.floor(Math.log(value) / Math.log(radix));
}

/**
 *
 * @param {string} str
 */
function strToUtf8Bytes(str) {
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
function bytesToUtf8Str(bytes) {
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

export {
  alphabets,
  BaseN,
  strToUtf8Bytes,
  bytesToUtf8Str
};

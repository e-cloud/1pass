/* eslint no-bitwise: 0, no-plusplus: 0 */
import createInteger from './BigInteger';
import { bytesToUtf8Str, getOptimalBitsCount, preparePowN, strToUtf8Bytes, twoInPowerN } from './BaseNHelpers'

/**
 * source from https://github.com/KvanTTT/BaseNcoding
 */

/**
 *
 * @param alphabet 字母表
 * @param blockMaxBitsCount 最大分区位数
 * @constructor
 */
class BaseNBig {
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
   * @param {number} index
   * @param {number} blockBitsCount
   * @param {number} blockCharsCount
   */
  encodeBlock(src, dst, index, blockBitsCount, blockCharsCount) {
    const charInd = index * blockCharsCount;
    const bitInd = index * blockBitsCount;
    const bits = getBitsN(src, bitInd, blockBitsCount);
    this.bitsToChars(dst, charInd, blockCharsCount, bits);
  }

  /**
   *
   * @param {string[]} chars
   * @param {number} index
   * @param {number} count
   * @param {number} initBlock
   */
  bitsToChars(chars, index, count, initBlock) {
    let block = initBlock;
    for (let i = 0; i < count; i++) {
      chars[index + i] = this.alphabet[block.mod(this.alphabetLen)];
      block = block.divide(this.alphabetLen);
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
    if (tailBits.shiftRight(tailBitsLength).compare(0) !== 0) {
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
    let result = createInteger(0);
    for (let i = 0; i < count; i++) {
      const bigInt = createInteger(this.inverseAlphabet[data[index + i]]);
      result = result.add(bigInt.multiply(this.powN[i]));
    }
    return result;
  }
}

function getBitsN(data, bitPos, bitsCount) {
  let result = createInteger(0);

  let curBytePos = Math.floor(bitPos / 8);
  let curBitInBytePos = bitPos % 8;
  let xLength = Math.min(bitsCount, 8 - curBitInBytePos);

  if (xLength !== 0) {
    let bigInt = createInteger(data[curBytePos]);
    result = bigInt.shiftRight(8 - xLength - curBitInBytePos)
      .and(twoInPowerN[7 - curBitInBytePos])
      .shiftLeft(bitsCount - xLength);

    curBytePos += Math.floor((curBitInBytePos + xLength) / 8);
    curBitInBytePos = (curBitInBytePos + xLength) % 8;

    let x2Length = bitsCount - xLength;
    if (x2Length > 8) x2Length = 8;

    while (x2Length > 0) {
      xLength += x2Length;
      result = result.or(createInteger(data[curBytePos] >> 8 - x2Length).shiftLeft(bitsCount - xLength));

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
    const x1 = value.shiftRight(bitsCount + curBitInBytePos - 8)
      .and(twoInPowerN[7 - curBitInBytePos]);
    data[curBytePos] |= x1;

    curBytePos += Math.floor((curBitInBytePos + xLength) / 8);
    curBitInBytePos = (curBitInBytePos + xLength) % 8;

    let x2Length = bitsCount - xLength;
    if (x2Length > 8) x2Length = 8;

    while (x2Length > 0) {
      xLength += x2Length;
      const x2 = value.shiftRight(bitsCount - xLength).shiftLeft(8 - x2Length).and(0xFF);
      data[curBytePos] |= x2;

      curBytePos += Math.floor((curBitInBytePos + x2Length) / 8);
      curBitInBytePos = (curBitInBytePos + x2Length) % 8;

      x2Length = bitsCount - xLength;
      if (x2Length > 8) x2Length = 8;
    }
  }
}

export default BaseNBig;

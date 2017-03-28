/* eslint no-bitwise: 0, no-plusplus: 0, no-param-reassign: 0, no-multi-assign: 0 */

/**
 * source from https://github.com/peterolson/BigInteger.js
 */

'use strict';

const BASE = 1e7;
const LOG_BASE = 7;
const MAX_INT = 9007199254740992;
const MAX_INT_ARR = smallToArray(MAX_INT);
const LOG_MAX_INT = Math.log(MAX_INT);

// Pre-define numbers in range [-999,999]
const preDefinedIntegers = [];

function createInteger(v, radix) {
  if (typeof v === 'undefined') return preDefinedIntegers[0];
  if (typeof radix !== 'undefined') return +radix === 10 ? parseValue(v) : parseBase(v, radix);
  return parseValue(v);
}

class BigInteger {
  constructor(value, sign) {
    this.value = value;
    this.sign = sign;
    this.isSmall = false;
  }

  add(v) {
    const n = parseValue(v);
    if (this.sign !== n.sign) {
      return this.subtract(n.negate());
    }
    const a = this.value;
    const b = n.value;
    if (n.isSmall) {
      return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
    }
    return new BigInteger(addAny(a, b), this.sign);
  }

  subtract(v) {
    const n = parseValue(v);
    if (this.sign !== n.sign) {
      return this.add(n.negate());
    }
    const a = this.value;
    const b = n.value;
    if (n.isSmall) return subtractSmall(a, Math.abs(b), this.sign);
    return subtractAny(a, b, this.sign);
  }

  negate() {
    return new BigInteger(this.value, !this.sign);
  }

  abs() {
    return new BigInteger(this.value, false);
  }

  multiply(v) {
    const n = parseValue(v);
    const a = this.value;
    let b = n.value;
    const sign = this.sign !== n.sign;
    let abs;
    if (n.isSmall) {
      if (b === 0) return preDefinedIntegers[0];
      if (b === 1) return this;
      if (b === -1) return this.negate();
      abs = Math.abs(b);
      if (abs < BASE) {
        return new BigInteger(multiplySmall(a, abs), sign);
      }
      b = smallToArray(abs);
    }
    if (useKaratsuba(a.length, b.length)) { // Karatsuba is only faster for certain array sizes
      return new BigInteger(multiplyKaratsuba(a, b), sign);
    }
    return new BigInteger(multiplyLong(a, b), sign);
  }

  _multiplyBySmall(a) {
    if (a.value === 0) return preDefinedIntegers[0];
    if (a.value === 1) return this;
    if (a.value === -1) return this.negate();
    return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
  }

  square() {
    return new BigInteger(square(this.value), false);
  }

  divmod(v) {
    const result = divModAny(this, v);
    return {
      quotient: result[0],
      remainder: result[1],
    };
  }

  divide(v) {
    return divModAny(this, v)[0];
  }

  mod(v) {
    return divModAny(this, v)[1];
  }

  pow(v) {
    const n = parseValue(v);
    const a = this.value;
    let b = n.value;

    let x;
    let y;
    if (b === 0) return preDefinedIntegers[1];
    if (a === 0) return preDefinedIntegers[0];
    if (a === 1) return preDefinedIntegers[1];
    if (a === -1) return n.isEven() ? preDefinedIntegers[1] : preDefinedIntegers[-1];
    if (n.sign) {
      return preDefinedIntegers[0];
    }
    if (!n.isSmall) throw new Error(`The exponent ${n.toString()} is too large.`);
    if (this.isSmall) {
      let value = a ** b;
      if (isPrecise(value)) return new SmallInteger(truncate(value));
    }
    x = this;
    y = preDefinedIntegers[1];
    while (true) {
      if ((b & 1) === 1) {
        y = y.multiply(x);
        --b;
      }
      if (b === 0) break;
      b /= 2;
      x = x.square();
    }
    return y;
  }

  modPow(exp, mod) {
    exp = parseValue(exp);
    mod = parseValue(mod);
    if (mod.isZero()) throw new Error('Cannot take modPow with modulus 0');
    let r = preDefinedIntegers[1];
    let base = this.mod(mod);
    while (exp.isPositive()) {
      if (base.isZero()) return preDefinedIntegers[0];
      if (exp.isOdd()) r = r.multiply(base).mod(mod);
      exp = exp.divide(2);
      base = base.square().mod(mod);
    }
    return r;
  }

  compareAbs(v) {
    const n = parseValue(v);
    const a = this.value;
    const b = n.value;
    if (n.isSmall) return 1;
    return compareAbs(a, b);
  }

  compare(v) {
    // See discussion about comparison with Infinity:
    // https://github.com/peterolson/BigInteger.js/issues/61
    if (v === Infinity) {
      return -1;
    }
    if (v === -Infinity) {
      return 1;
    }

    const n = parseValue(v);
    const a = this.value;
    const b = n.value;
    if (this.sign !== n.sign) {
      return n.sign ? 1 : -1;
    }
    if (n.isSmall) {
      return this.sign ? -1 : 1;
    }
    return compareAbs(a, b) * (this.sign ? -1 : 1);
  }

  equals(v) {
    return this.compare(v) === 0;
  }

  notEquals(v) {
    return this.compare(v) !== 0;
  }

  greater(v) {
    return this.compare(v) > 0;
  }

  lesser(v) {
    return this.compare(v) < 0;
  }

  greaterOrEquals(v) {
    return this.compare(v) >= 0;
  }

  lesserOrEquals(v) {
    return this.compare(v) <= 0;
  }

  isEven() {
    return (this.value[0] & 1) === 0;
  }

  isOdd() {
    return (this.value[0] & 1) === 1;
  }

  isPositive() {
    return !this.sign;
  }

  isNegative() {
    return this.sign;
  }

  isUnit() {
    return false;
  }

  isZero() {
    return false;
  }

  isDivisibleBy(v) {
    const n = parseValue(v);
    const value = n.value;
    if (value === 0) return false;
    if (value === 1) return true;
    if (value === 2) return this.isEven();
    return this.mod(n).equals(preDefinedIntegers[0]);
  }

  isPrime() {
    const isPrime = isBasicPrime(this);
    if (isPrime !== undefined) return isPrime;
    const n = this.abs();
    const nPrev = n.prev();
    const a = [2, 3, 5, 7, 11, 13, 17, 19];
    let b = nPrev;
    let d;
    let t;
    let i;
    let x;
    while (b.isEven()) b = b.divide(2);
    for (i = 0; i < a.length; i++) {
      x = createInteger(a[i]).modPow(b, n);
      if (x.equals(preDefinedIntegers[1]) || x.equals(nPrev)) continue;
      for (t = true, d = b; t && d.lesser(nPrev); d = d.multiply(2)) {
        x = x.square().mod(n);
        if (x.equals(nPrev)) t = false;
      }
      if (t) return false;
    }
    return true;
  }

  isProbablePrime(iterations) {
    const isPrime = isBasicPrime(this);
    if (isPrime !== undefined) return isPrime;
    const n = this.abs();
    const t = iterations === undefined ? 5 : iterations;
    // use the Fermat primality test
    for (let i = 0; i < t; i++) {
      const a = randBetween(2, n.minus(2));
      if (!a.modPow(n.prev(), n).isUnit()) return false; // definitely composite
    }
    return true; // large chance of being prime
  }

  modInv(n) {
    let t = preDefinedIntegers[0];
    let newT = preDefinedIntegers[1];
    let r = parseValue(n);
    let newR = this.abs();
    let q;
    let lastT;
    let lastR;
    while (!newR.equals(preDefinedIntegers[0])) {
      q = r.divide(newR);
      lastT = t;
      lastR = r;
      t = newT;
      r = newR;
      newT = lastT.subtract(q.multiply(newT));
      newR = lastR.subtract(q.multiply(newR));
    }
    if (!r.equals(1)) throw new Error(`${this.toString()} and ${n.toString()} are not co-prime`);
    if (t.compare(0) === -1) {
      t = t.add(n);
    }
    return t;
  }

  next() {
    const value = this.value;
    if (this.sign) {
      return subtractSmall(value, 1, this.sign);
    }
    return new BigInteger(addSmall(value, 1), this.sign);
  }

  prev() {
    const value = this.value;
    if (this.sign) {
      return new BigInteger(addSmall(value, 1), true);
    }
    return subtractSmall(value, 1, this.sign);
  }

  shiftLeft(n) {
    if (!shift_isSmall(n)) {
      throw new Error(`${String(n)} is too large for shifting.`);
    }
    n = +n;
    if (n < 0) return this.shiftRight(-n);
    let result = this;
    while (n >= powers2Length) {
      result = result.multiply(highestPower2);
      n -= powers2Length - 1;
    }
    return result.multiply(powersOfTwo[n]);
  }

  shiftRight(n) {
    let remQuo;
    if (!shift_isSmall(n)) {
      throw new Error(`${String(n)} is too large for shifting.`);
    }
    n = +n;
    if (n < 0) return this.shiftLeft(-n);
    let result = this;
    while (n >= powers2Length) {
      if (result.isZero()) return result;
      remQuo = divModAny(result, highestPower2);
      result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
      n -= powers2Length - 1;
    }
    remQuo = divModAny(result, powersOfTwo[n]);
    return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
  }

  not() {
    return this.negate().prev();
  }

  and(n) {
    return bitwise(this, n, (a, b) => a & b);
  }

  or(n) {
    return bitwise(this, n, (a, b) => a | b);
  }

  xor(n) {
    return bitwise(this, n, (a, b) => a ^ b);
  }

  toString(radix) {
    if (radix === undefined) radix = 10;
    if (radix !== 10) return toBase(this, radix);
    const v = this.value;
    let l = v.length;
    let str = String(v[--l]);
    const zeros = '0000000';
    let digit;
    while (--l >= 0) {
      digit = String(v[l]);
      str += zeros.slice(digit.length) + digit;
    }
    const sign = this.sign ? '-' : '';
    return sign + str;
  }

  valueOf() {
    return +this.toString();
  }
}

class SmallInteger extends BigInteger {
  constructor(value) {
    super();
    this.value = value;
    this.sign = value < 0;
    this.isSmall = true;
  }

  add(v) {
    const n = parseValue(v);
    const a = this.value;
    if (a < 0 !== n.sign) {
      return this.subtract(n.negate());
    }
    let b = n.value;
    if (n.isSmall) {
      if (isPrecise(a + b)) return new SmallInteger(a + b);
      b = smallToArray(Math.abs(b));
    }
    return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
  }

  subtract(v) {
    const n = parseValue(v);
    const a = this.value;
    if (a < 0 !== n.sign) {
      return this.add(n.negate());
    }
    const b = n.value;
    if (n.isSmall) {
      return new SmallInteger(a - b);
    }
    return subtractSmall(b, Math.abs(a), a >= 0);
  }

  negate() {
    const sign = this.sign;
    const small = new SmallInteger(-this.value);
    small.sign = !sign;
    return small;
  }

  abs() {
    return new SmallInteger(Math.abs(this.value));
  }

  _multiplyBySmall(a) {
    if (isPrecise(a.value * this.value)) {
      return new SmallInteger(a.value * this.value);
    }
    return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
  }

  multiply(v) {
    return parseValue(v)._multiplyBySmall(this);
  }

  square() {
    const value = this.value * this.value;
    if (isPrecise(value)) return new SmallInteger(value);
    return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
  }

  compareAbs(v) {
    const n = parseValue(v);
    const a = Math.abs(this.value);
    let b = n.value;
    if (n.isSmall) {
      b = Math.abs(b);
      return a === b ? 0 : a > b ? 1 : -1;
    }
    return -1;
  }

  compare(v) {
    if (v === Infinity) {
      return -1;
    }
    if (v === -Infinity) {
      return 1;
    }

    const n = parseValue(v);
    const a = this.value;
    const b = n.value;
    if (n.isSmall) {
      return a == b ? 0 : a > b ? 1 : -1;
    }
    if (a < 0 !== n.sign) {
      return a < 0 ? -1 : 1;
    }
    return a < 0 ? 1 : -1;
  }

  isEven() {
    return (this.value & 1) === 0;
  }

  isOdd() {
    return (this.value & 1) === 1;
  }

  isPositive() {
    return this.value > 0;
  }

  isNegative() {
    return this.value < 0;
  }

  isUnit() {
    return Math.abs(this.value) === 1;
  }

  isZero() {
    return this.value === 0;
  }

  next() {
    const value = this.value;
    if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
    return new BigInteger(MAX_INT_ARR, false);
  }

  prev() {
    const value = this.value;
    if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
    return new BigInteger(MAX_INT_ARR, true);
  }

  toString(radix) {
    if (radix === undefined) radix = 10;
    if (radix != 10) return toBase(this, radix);
    return String(this.value);
  }

  valueOf() {
    return this.value;
  }
}

for (let i = 0; i < 1000; i++) {
  preDefinedIntegers[i] = new SmallInteger(i);
  if (i > 0) preDefinedIntegers[-i] = new SmallInteger(-i);
}

function isPrecise(n) {
  return -MAX_INT < n && n < MAX_INT;
}

function smallToArray(n) {
  // For performance reasons doesn't reference BASE, need to change this function if BASE changes
  if (n < 1e7) return [n];
  if (n < 1e14) return [n % 1e7, Math.floor(n / 1e7)];
  return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
}

function arrayToSmall(arr) {
  // If BASE changes this function may need to change
  trim(arr);
  const length = arr.length;
  if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
    switch (length) {
      case 0:
        return 0;
      case 1:
        return arr[0];
      case 2:
        return arr[0] + arr[1] * BASE;
      default:
        return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
    }
  }
  return arr;
}

function trim(v) {
  let i = v.length;
  while (v[--i] === 0);
  v.length = i + 1;
}

function createArray(length) {
  // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
  const x = new Array(length);
  let i = -1;
  while (++i < length) {
    x[i] = 0;
  }
  return x;
}

function truncate(n) {
  if (n > 0) return Math.floor(n);
  return Math.ceil(n);
}

function add(a, b) {
  // assumes a and b are arrays with a.length >= b.length
  const lenA = a.length;

  const lenB = b.length;
  const r = new Array(lenA);
  let carry = 0;
  const base = BASE;
  let sum;
  let i;
  for (i = 0; i < lenB; i++) {
    sum = a[i] + b[i] + carry;
    carry = sum >= base ? 1 : 0;
    r[i] = sum - carry * base;
  }
  while (i < lenA) {
    sum = a[i] + carry;
    carry = sum === base ? 1 : 0;
    r[i++] = sum - carry * base;
  }
  if (carry > 0) r.push(carry);
  return r;
}

function addAny(a, b) {
  if (a.length >= b.length) return add(a, b);
  return add(b, a);
}

function addSmall(a, carry) {
  // assumes a is array, carry is number with 0 <= carry < MAX_INT
  const l = a.length;

  const r = new Array(l);
  const base = BASE;
  let sum;
  let i;
  for (i = 0; i < l; i++) {
    sum = a[i] - base + carry;
    carry = Math.floor(sum / base);
    r[i] = sum - carry * base;
    carry += 1;
  }
  while (carry > 0) {
    r[i++] = carry % base;
    carry = Math.floor(carry / base);
  }
  return r;
}

function subtract(a, b) {
  // assumes a and b are arrays with a >= b
  const lenA = a.length;

  const lenB = b.length;
  const r = new Array(lenA);
  let borrow = 0;
  const base = BASE;
  let i;
  let difference;
  for (i = 0; i < lenB; i++) {
    difference = a[i] - borrow - b[i];
    if (difference < 0) {
      difference += base;
      borrow = 1;
    } else borrow = 0;
    r[i] = difference;
  }
  for (i = lenB; i < lenA; i++) {
    difference = a[i] - borrow;
    if (difference < 0) difference += base;
    else {
      r[i++] = difference;
      break;
    }
    r[i] = difference;
  }
  for (; i < lenA; i++) {
    r[i] = a[i];
  }
  trim(r);
  return r;
}

function subtractAny(a, b, sign) {
  let value;
  if (compareAbs(a, b) >= 0) {
    value = subtract(a, b);
  } else {
    value = subtract(b, a);
    sign = !sign;
  }
  value = arrayToSmall(value);
  if (typeof value === 'number') {
    if (sign) value = -value;
    return new SmallInteger(value);
  }
  return new BigInteger(value, sign);
}

function subtractSmall(a, b, sign) {
  // assumes a is array, b is number with 0 <= b < MAX_INT
  const l = a.length;

  let r = new Array(l);
  let carry = -b;
  const base = BASE;
  let i;
  let difference;
  for (i = 0; i < l; i++) {
    difference = a[i] + carry;
    carry = Math.floor(difference / base);
    difference %= base;
    r[i] = difference < 0 ? difference + base : difference;
  }
  r = arrayToSmall(r);
  if (typeof r === 'number') {
    if (sign) r = -r;
    return new SmallInteger(r);
  }
  return new BigInteger(r, sign);
}

function multiplyLong(a, b) {
  const lenA = a.length;
  const lenB = b.length;
  const l = lenA + lenB;
  const r = createArray(l);
  const base = BASE;
  let product;
  let carry;
  let i;
  let a_i;
  let b_j;
  for (i = 0; i < lenA; ++i) {
    a_i = a[i];
    for (let j = 0; j < lenB; ++j) {
      b_j = b[j];
      product = a_i * b_j + r[i + j];
      carry = Math.floor(product / base);
      r[i + j] = product - carry * base;
      r[i + j + 1] += carry;
    }
  }
  trim(r);
  return r;
}

function multiplySmall(a, b) {
  // assumes a is array, b is number with |b| < BASE
  const l = a.length;

  const r = new Array(l);
  const base = BASE;
  let carry = 0;
  let product;
  let i;
  for (i = 0; i < l; i++) {
    product = a[i] * b + carry;
    carry = Math.floor(product / base);
    r[i] = product - carry * base;
  }
  while (carry > 0) {
    r[i++] = carry % base;
    carry = Math.floor(carry / base);
  }
  return r;
}

function shiftLeft(x, n) {
  const r = [];
  while (n-- > 0) r.push(0);
  return r.concat(x);
}

function multiplyKaratsuba(x, y) {
  let n = Math.max(x.length, y.length);

  if (n <= 30) return multiplyLong(x, y);
  n = Math.ceil(n / 2);

  const b = x.slice(n);
  const a = x.slice(0, n);
  const d = y.slice(n);
  const c = y.slice(0, n);
  const ac = multiplyKaratsuba(a, c);
  const bd = multiplyKaratsuba(b, d);
  const abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

  const product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
  trim(product);
  return product;
}

// The following function is derived from a surface fit of a graph plotting the performance difference
// between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
function useKaratsuba(l1, l2) {
  return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
}

function multiplySmallAndArray(a, b, sign) {
  // a >= 0
  if (a < BASE) {
    return new BigInteger(multiplySmall(b, a), sign);
  }
  return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
}

function square(a) {
  const l = a.length;
  const r = createArray(l + l);
  const base = BASE;
  let product;
  let carry;
  let i;
  let a_i;
  let a_j;
  for (i = 0; i < l; i++) {
    a_i = a[i];
    for (let j = 0; j < l; j++) {
      a_j = a[j];
      product = a_i * a_j + r[i + j];
      carry = Math.floor(product / base);
      r[i + j] = product - carry * base;
      r[i + j + 1] += carry;
    }
  }
  trim(r);
  return r;
}

function divMod1(a, b) {
  // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
  const lenA = a.length;

  const lenB = b.length;
  const base = BASE;
  const result = createArray(b.length);
  let divisorMostSignificantDigit = b[lenB - 1];

  const // normalization
    lambda = Math.ceil(base / (2 * divisorMostSignificantDigit));

  let remainder = multiplySmall(a, lambda);
  const divisor = multiplySmall(b, lambda);
  let quotientDigit;
  let shift;
  let carry;
  let borrow;
  let i;
  let l;
  let q;
  if (remainder.length <= lenA) remainder.push(0);
  divisor.push(0);
  divisorMostSignificantDigit = divisor[lenB - 1];
  for (shift = lenA - lenB; shift >= 0; shift--) {
    quotientDigit = base - 1;
    if (remainder[shift + lenB] !== divisorMostSignificantDigit) {
      quotientDigit = Math.floor((remainder[shift + lenB] * base + remainder[shift + lenB - 1]) / divisorMostSignificantDigit);
    }
    // quotientDigit <= base - 1
    carry = 0;
    borrow = 0;
    l = divisor.length;
    for (i = 0; i < l; i++) {
      carry += quotientDigit * divisor[i];
      q = Math.floor(carry / base);
      borrow += remainder[shift + i] - (carry - q * base);
      carry = q;
      if (borrow < 0) {
        remainder[shift + i] = borrow + base;
        borrow = -1;
      } else {
        remainder[shift + i] = borrow;
        borrow = 0;
      }
    }
    while (borrow !== 0) {
      quotientDigit -= 1;
      carry = 0;
      for (i = 0; i < l; i++) {
        carry += remainder[shift + i] - base + divisor[i];
        if (carry < 0) {
          remainder[shift + i] = carry + base;
          carry = 0;
        } else {
          remainder[shift + i] = carry;
          carry = 1;
        }
      }
      borrow += carry;
    }
    result[shift] = quotientDigit;
  }
  // denormalization
  remainder = divModSmall(remainder, lambda)[0];
  return [arrayToSmall(result), arrayToSmall(remainder)];
}

function divMod2(a, b) {
  // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
  // Performs faster than divMod1 on larger input sizes.
  let lenA = a.length;

  const lenB = b.length;
  const result = [];
  let part = [];
  const base = BASE;
  let guess;
  let xlen;
  let highx;
  let highy;
  let check;
  while (lenA) {
    part.unshift(a[--lenA]);
    if (compareAbs(part, b) < 0) {
      result.push(0);
      continue;
    }
    xlen = part.length;
    highx = part[xlen - 1] * base + part[xlen - 2];
    highy = b[lenB - 1] * base + b[lenB - 2];
    if (xlen > lenB) {
      highx = (highx + 1) * base;
    }
    guess = Math.ceil(highx / highy);
    do {
      check = multiplySmall(b, guess);
      if (compareAbs(check, part) <= 0) break;
      guess--;
    } while (guess);
    result.push(guess);
    part = subtract(part, check);
  }
  result.reverse();
  return [arrayToSmall(result), arrayToSmall(part)];
}

function divModSmall(value, lambda) {
  const length = value.length;
  const quotient = createArray(length);
  const base = BASE;
  let i;
  let q;
  let remainder;
  let divisor;
  remainder = 0;
  for (i = length - 1; i >= 0; --i) {
    divisor = remainder * base + value[i];
    q = truncate(divisor / lambda);
    remainder = divisor - q * lambda;
    quotient[i] = q | 0;
  }
  return [quotient, remainder | 0];
}

function divModAny(self, v) {
  let value;
  const n = parseValue(v);
  const a = self.value;
  let b = n.value;
  let quotient;
  if (b === 0) throw new Error('Cannot divide by zero');
  if (self.isSmall) {
    if (n.isSmall) {
      return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
    }
    return [preDefinedIntegers[0], self];
  }
  if (n.isSmall) {
    if (b === 1) return [self, preDefinedIntegers[0]];
    if (b == -1) return [self.negate(), preDefinedIntegers[0]];
    const abs = Math.abs(b);
    if (abs < BASE) {
      value = divModSmall(a, abs);
      quotient = arrayToSmall(value[0]);
      let remainder = value[1];
      if (self.sign) remainder = -remainder;
      if (typeof quotient === 'number') {
        if (self.sign !== n.sign) quotient = -quotient;
        return [new SmallInteger(quotient), new SmallInteger(remainder)];
      }
      return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
    }
    b = smallToArray(abs);
  }
  const comparison = compareAbs(a, b);
  if (comparison === -1) return [preDefinedIntegers[0], self];
  if (comparison === 0) return [preDefinedIntegers[self.sign === n.sign ? 1 : -1], preDefinedIntegers[0]];

  // divMod1 is faster on smaller input sizes
  if (a.length + b.length <= 200) value = divMod1(a, b);
  else value = divMod2(a, b);

  quotient = value[0];
  const qSign = self.sign !== n.sign;
  let mod = value[1];
  const mSign = self.sign;
  if (typeof quotient === 'number') {
    if (qSign) quotient = -quotient;
    quotient = new SmallInteger(quotient);
  } else quotient = new BigInteger(quotient, qSign);
  if (typeof mod === 'number') {
    if (mSign) mod = -mod;
    mod = new SmallInteger(mod);
  } else mod = new BigInteger(mod, mSign);
  return [quotient, mod];
}

function compareAbs(a, b) {
  if (a.length !== b.length) {
    return a.length > b.length ? 1 : -1;
  }
  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
}

function isBasicPrime(v) {
  const n = v.abs();
  if (n.isUnit()) return false;
  if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
  if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
  if (n.lesser(25)) return true;
  // we don't know if it's prime: let the other functions figure it out
}


const powersOfTwo = [1];
while (powersOfTwo[powersOfTwo.length - 1] <= BASE) {
  powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
}
const powers2Length = powersOfTwo.length;
const highestPower2 = powersOfTwo[powers2Length - 1];

function shift_isSmall(n) {
  return (typeof n === 'number' || typeof n === 'string') && +Math.abs(n) <= BASE || n instanceof BigInteger && n.value.length <= 1;
}

function bitwise(x, y, fn) {
  y = parseValue(y);
  const xSign = x.isNegative();
  const ySign = y.isNegative();
  let xRem = xSign ? x.not() : x;
  let yRem = ySign ? y.not() : y;
  const xBits = [];
  const yBits = [];
  let xStop = false;
  let yStop = false;
  while (!xStop || !yStop) {
    if (xRem.isZero()) {
      // virtual sign extension for simulating two's complement
      xStop = true;
      xBits.push(xSign ? 1 : 0);
    } else if (xSign) xBits.push(xRem.isEven() ? 1 : 0); // two's complement for negative numbers
    else xBits.push(xRem.isEven() ? 0 : 1);

    if (yRem.isZero()) {
      yStop = true;
      yBits.push(ySign ? 1 : 0);
    } else if (ySign) yBits.push(yRem.isEven() ? 1 : 0);
    else yBits.push(yRem.isEven() ? 0 : 1);

    xRem = xRem.divide(2);
    yRem = yRem.divide(2);
  }
  const result = [];
  for (let i = 0; i < xBits.length; i++) result.push(fn(xBits[i], yBits[i]));
  let sum = createInteger(result.pop()).negate().multiply(createInteger(2).pow(result.length));
  while (result.length) {
    sum = sum.add(createInteger(result.pop()).multiply(createInteger(2).pow(result.length)));
  }
  return sum;
}

const LOBMASK_I = 1 << 30;
const LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;

function roughLOB(n) {
  // get lowestOneBit (rough)
  // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
  // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
  const v = n.value;

  const x = typeof v === 'number' ? v | LOBMASK_I : v[0] + v[1] * BASE | LOBMASK_BI;
  return x & -x;
}

function max(a, b) {
  a = parseValue(a);
  b = parseValue(b);
  return a.greater(b) ? a : b;
}

function min(a, b) {
  a = parseValue(a);
  b = parseValue(b);
  return a.lesser(b) ? a : b;
}

function gcd(a, b) {
  a = parseValue(a).abs();
  b = parseValue(b).abs();
  if (a.equals(b)) return a;
  if (a.isZero()) return b;
  if (b.isZero()) return a;
  let c = preDefinedIntegers[1];
  let d;
  let t;
  while (a.isEven() && b.isEven()) {
    d = Math.min(roughLOB(a), roughLOB(b));
    a = a.divide(d);
    b = b.divide(d);
    c = c.multiply(d);
  }
  while (a.isEven()) {
    a = a.divide(roughLOB(a));
  }
  do {
    while (b.isEven()) {
      b = b.divide(roughLOB(b));
    }
    if (a.greater(b)) {
      t = b;
      b = a;
      a = t;
    }
    b = b.subtract(a);
  } while (!b.isZero());
  return c.isUnit() ? a : a.multiply(c);
}

function lcm(a, b) {
  a = parseValue(a).abs();
  b = parseValue(b).abs();
  return a.divide(gcd(a, b)).multiply(b);
}

function randBetween(a, b) {
  a = parseValue(a);
  b = parseValue(b);
  const low = min(a, b);
  const high = max(a, b);
  const range = high.subtract(low);
  if (range.isSmall) return low.add(Math.round(Math.random() * range));
  const length = range.value.length - 1;
  let result = [];
  let restricted = true;
  for (let i = length; i >= 0; i--) {
    const top = restricted ? range.value[i] : BASE;
    const digit = truncate(Math.random() * top);
    result.unshift(digit);
    if (digit < top) restricted = false;
  }
  result = arrayToSmall(result);
  return low.add(typeof result === 'number' ? new SmallInteger(result) : new BigInteger(result, false));
}

function parseBase(text, base) {
  let val = preDefinedIntegers[0];
  let pow = preDefinedIntegers[1];
  const length = text.length;
  if (base >= 2 && base <= 36) {
    if (length <= LOG_MAX_INT / Math.log(base)) {
      return new SmallInteger(parseInt(text, base));
    }
  }
  base = parseValue(base);
  const digits = [];
  let i;
  const isNegative = text[0] === '-';
  for (i = isNegative ? 1 : 0; i < text.length; i++) {
    const c = text[i].toLowerCase();
    const charCode = c.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57) digits.push(parseValue(c));
    else if (charCode >= 97 && charCode <= 122) digits.push(parseValue(c.charCodeAt(0) - 87));
    else if (c === '<') {
      const start = i;
      do {
        i++;
      } while (text[i] !== '>');
      digits.push(parseValue(text.slice(start + 1, i)));
    } else throw new Error(`${c} is not a valid character`);
  }
  digits.reverse();
  for (i = 0; i < digits.length; i++) {
    val = val.add(digits[i].multiply(pow));
    pow = pow.multiply(base);
  }
  return isNegative ? val.negate() : val;
}

function stringify(digit) {
  let v = digit.value;
  if (typeof v === 'number') v = [v];
  if (v.length === 1 && v[0] <= 35) {
    return '0123456789abcdefghijklmnopqrstuvwxyz'.charAt(v[0]);
  }
  return `<${v}>`;
}

function toBase(n, base) {
  base = createInteger(base);
  if (base.isZero()) {
    if (n.isZero()) return '0';
    throw new Error('Cannot convert nonzero numbers to base 0.');
  }
  if (base.equals(-1)) {
    if (n.isZero()) return '0';
    if (n.isNegative()) return new Array(1 - n).join('10');
    return `1${new Array(+n).join('01')}`;
  }
  let minusSign = '';
  if (n.isNegative() && base.isPositive()) {
    minusSign = '-';
    n = n.abs();
  }
  if (base.equals(1)) {
    if (n.isZero()) return '0';
    return minusSign + new Array(+n + 1).join(1);
  }
  const out = [];
  let left = n;
  let divmod;
  while (left.isNegative() || left.compareAbs(base) >= 0) {
    divmod = left.divmod(base);
    left = divmod.quotient;
    let digit = divmod.remainder;
    if (digit.isNegative()) {
      digit = base.minus(digit).abs();
      left = left.next();
    }
    out.push(stringify(digit));
  }
  out.push(stringify(left));
  return minusSign + out.reverse().join('');
}

function parseStringValue(v) {
  if (isPrecise(+v)) {
    const x = +v;
    if (x === truncate(x)) return new SmallInteger(x);
    throw `Invalid integer: ${v}`;
  }
  const sign = v[0] === '-';
  if (sign) v = v.slice(1);
  const split = v.split(/e/i);
  if (split.length > 2) throw new Error(`Invalid integer: ${split.join('e')}`);
  if (split.length === 2) {
    let exp = split[1];
    if (exp[0] === '+') exp = exp.slice(1);
    exp = +exp;
    if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error(`Invalid integer: ${exp} is not a valid exponent.`);
    let text = split[0];
    const decimalPlace = text.indexOf('.');
    if (decimalPlace >= 0) {
      exp -= text.length - decimalPlace - 1;
      text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
    }
    if (exp < 0) throw new Error('Cannot include negative exponent part for integers');
    text += new Array(exp + 1).join('0');
    v = text;
  }
  const isValid = /^([0-9][0-9]*)$/.test(v);
  if (!isValid) throw new Error(`Invalid integer: ${v}`);
  const r = [];
  let maxV = v.length;
  const l = LOG_BASE;
  let minV = maxV - l;
  while (maxV > 0) {
    r.push(+v.slice(minV, maxV));
    minV -= l;
    if (minV < 0) minV = 0;
    maxV -= l;
  }
  trim(r);
  return new BigInteger(r, sign);
}

function parseNumberValue(v) {
  if (isPrecise(v)) {
    if (v !== truncate(v)) throw new Error(`${v} is not an integer.`);
    return new SmallInteger(v);
  }
  return parseStringValue(v.toString());
}

function parseValue(v) {
  if (typeof v === 'number') {
    return parseNumberValue(v);
  }
  if (typeof v === 'string') {
    return parseStringValue(v);
  }
  return v;
}

export default createInteger;

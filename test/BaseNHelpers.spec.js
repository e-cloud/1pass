import { bytesToUtf8Str, strToUtf8Bytes } from '../src/lib/BaseNHelpers'
import { expect } from 'chai'

describe('Test BaseN helpers', () => {
  it('should convert string to utf8 bytes', () => {
    const res = strToUtf8Bytes('test');

    expect(res).to.eql([116, 101, 115, 116]);
  });

  it('should convert utf8 bytes to string', () => {
    const res = bytesToUtf8Str([116, 101, 115, 116]);

    expect(res).to.equal('test');
  });
})

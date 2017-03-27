const BaseN = require('../src/lib/BaseN');
const expect = require('chai').expect;

describe('BaseN Tests', () => {
  describe('Test BaseN helpers', () => {
    it('should convert string to utf8 bytes', () => {
      const res = BaseN.strToUtf8Bytes('test');

      expect(res).to.eql([116, 101, 115, 116]);
    });

    it('should convert utf8 bytes to string', () => {
      const res = BaseN.bytesToUtf8Str([116, 101, 115, 116]);

      expect(res).to.equal('test');
    });
  });

  describe('with short string', () => {
    const originStr = 'test';
    it('should encode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).encodeString(originStr);

      expect(res).to.equal('8475082591');
    });

    it('should decode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).decodeToString('8475082591');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).encodeString(originStr);

      expect(res).to.equal('ORSXG5A');
    });

    it('should decode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).decodeToString('ORSXG5A');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).encodeString(originStr);

      expect(res).to.equal('48vJIC');
    });

    it('should decode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).decodeToString('48vJIC');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).encodeString(originStr);

      expect(res).to.equal('dGVzdA');
    });

    it('should decode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).decodeToString('dGVzdA');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).encodeString(originStr);

      expect(res).to.equal('8NfCF');
    });

    it('should decode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).decodeToString('8NfCF');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).encodeString(originStr);

      expect(res).to.equal('_oe90');
    });

    it('should decode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).decodeToString('_oe90');

      expect(res).to.equal(originStr);
    });
  });

  describe('with long string', () => {
    const originStr = 'xcvjnadad+-*erev;2[]3;4';

    it('should encode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).encodeString(originStr);

      expect(res).to.equal('82379086335735473347193963040414616146298538886975777061');
    });

    it('should decode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).decodeToString('82379086335735473347193963040414616146298538886975777061');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).encodeString(originStr);

      expect(res).to.equal('PBRXM2TOMFSGCZBLFUVGK4TFOY5TEW25GM5TE');
    });

    it('should decode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).decodeToString('PBRXM2TOMFSGCZBLFUVGK4TFOY5TEW25GM5TE');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).encodeString(originStr);

      expect(res).to.equal('1ho2ilIlBUHpvBno6w0B4FmMZW82iP0A');
    });

    it('should decode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).decodeToString('1ho2ilIlBUHpvBno6w0B4FmMZW82iP0A');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).encodeString(originStr);

      expect(res).to.equal('eGN2am5hZGFkKy0qZXJldjsyW10zOzE');
    });

    it('should decode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).decodeToString('eGN2am5hZGFkKy0qZXJldjsyW10zOzE');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).encodeString(originStr);

      expect(res).to.equal("3ok[Ga'IID]5K1A*@DTAG#1#4n\\H&");
    });

    it('should decode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).decodeToString("3ok[Ga'IID]5K1A*@DTAG#1#4n\\H&");

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).encodeString(originStr);

      expect(res).to.equal('eq|m!7LR6Yo+s,WdUop9Y^FQY:6pA');
    });

    it('should decode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).decodeToString('eq|m!7LR6Yo+s,WdUop9Y^FQY:6pA');

      expect(res).to.equal(originStr);
    });
  });
});

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

  describe('with long long long string', () => {
    const originStr = '1235wdsd*&%@34155516.]\'{}>>"|;:`~)(_9-!@#$%^&*($ksjriojgsd+8*-+9*/e89rt8+28234*s/-*t8445756gh';

    it('should encode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).encodeString(originStr);

      expect(res).to.equal('683876117080674277154829739098988295701116562305016905872878532146254908220489474480530888048208429827838645659300068173397712636842574326961054911445470165162840648759502221470667679548110168619955750837194656983709311144811');
    });

    it('should decode the target string under alphabet 10', () => {
      const res = new BaseN.BaseN('0123456789', 64).decodeToString('683876117080674277154829739098988295701116562305016905872878532146254908220489474480530888048208429827838645659300068173397712636842574326961054911445470165162840648759502221470667679548110168619955750837194656983709311144811');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).encodeString(originStr);

      expect(res).to.equal('GEZDGNLXMRZWIKRGEVADGNBRGU2TKMJWFZOSO635HY7CE7B3HJQH4KJIL44S2IKAEMSCKXRGFIUCI23TNJZGS33KM5ZWIKZYFIWSWOJKF5STQOLSOQ4CWMRYGIZTIKTTF4WSU5BYGQ2DKNZVGZTWI');
    });

    it('should decode the target string under alphabet 32', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['32'], 64).decodeToString('GEZDGNLXMRZWIKRGEVADGNBRGU2TKMJWFZOSO635HY7CE7B3HJQH4KJIL44S2IKAEMSCKXRGFIUCI23TNJZGS33KM5ZWIKZYFIWSWOJKF5STQOLSOQ4CWMRYGIZTIKTTF4WSU5BYGQ2DKNZVGZTWI');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).encodeString(originStr);

      expect(res).to.equal('lZycEsFXLIiJX0q7tlhF6iVQBRmO1MhplObl0XINwi0yNFVv2d6x4uvcmyCZqgfZDyZZYZnewGZhP8zMZnwEDjAPVJyB1jSSXo6Gg1QFNqV9mXnuW43sGmBP0cnExhA');
    });

    it('should decode the target string under alphabet 62', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['62'], 64).decodeToString('lZycEsFXLIiJX0q7tlhF6iVQBRmO1MhplObl0XINwi0yNFVv2d6x4uvcmyCZqgfZDyZZYZnewGZhP8zMZnwEDjAPVJyB1jSSXo6Gg1QFNqV9mXnuW43sGmBP0cnExhA');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).encodeString(originStr);

      expect(res).to.equal('MTIzNXdkc2QqJiVAMzQxNTU1MTYuXSd7fT4+Inw7OmB+KShfOS0hQCMkJV4mKigka3NqcmlvamdzZCs4Ki0rOSovZTg5cnQ4KzI4MjM0KnMvLSp0ODQ0NTc1Nmdo');
    });

    it('should decode the target string under alphabet 64', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['64'], 64).decodeToString('MTIzNXdkc2QqJiVAMzQxNTU1MTYuXSd7fT4+Inw7OmB+KShfOS0hQCMkJV4mKigka3NqcmlvamdzZCs4Ki0rOSovZTg5cnQ4KzI4MjM0KnMvLSp0ODQ0NTc1Nmdo');

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).encodeString(originStr);

      expect(res).to.equal("BOte0*cY@G,HHO.DggG1H*R)2OiTm/=hK6IsAjoHP[QOI>Cu@3AR\":,hDU7-26FNC!a@lB\\d?(F2/3P.m?GP.$4BH3>('l.&SgG1qYe.0LHE&3+L3`24\"");
    });

    it('should decode the target string under alphabet 85', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['85'], 64).decodeToString("BOte0*cY@G,HHO.DggG1H*R)2OiTm/=hK6IsAjoHP[QOI>Cu@3AR\":,hDU7-26FNC!a@lB\\d?(F2/3P.m?GP.$4BH3>('l.&SgG1qYe.0LHE&3+L3`24\"");

      expect(res).to.equal(originStr);
    });

    it('should encode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).encodeString(originStr);

      expect(res).to.equal('bR)YS;9!HT6dawzAgS1N<:81+iu%h>Y]=V|bc^|Q9?jcx.`kyWfjz0$GN53Z8=jdGlo^s34!L#8dba.+8Q&6/@nU|tdjlEC2_O;jw#nUOu%kgb97hkA');
    });

    it('should decode the target string under alphabet 91', () => {
      const res = new BaseN.BaseN(BaseN.alphabets['91'], 64).decodeToString('bR)YS;9!HT6dawzAgS1N<:81+iu%h>Y]=V|bc^|Q9?jcx.`kyWfjz0$GN53Z8=jdGlo^s34!L#8dba.+8Q&6/@nU|tdjlEC2_O;jw#nUOu%kgb97hkA');

      expect(res).to.equal(originStr);
    });
  });
});

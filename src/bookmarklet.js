import JsSHA from 'jssha/src/sha3'
import tpl from './bookmarklet.html'
import { extractCoreDomain } from './domainExtractor'
import { generateAlphabet } from './lib/BaseNHelpers'
import BaseN from './lib/BaseN'

const $ = (selector, context = document) => context.querySelector(selector);

const state = {
  version: PKG_VERSION,
  domain: extractCoreDomain(),
  passLenRange: new Array(123).fill(0).map((v, k) => k + 6),
  passOutLen: 16,
  charset: 94,
  itCount: 100,
  salt: 'I am a dummy salt. Don\'t use me.'
};

const octopus = {
  init(state) {
    view.init(state);
  },
  generate(info) {
    const hashedKey = octopus.hash(info);
    const hmac = octopus.hmac(hashedKey, info);
    return octopus.mapKeyToCharset(hmac, info.passOutLen, info.charset);
  },
  hash(info) {
    const sha3 = new JsSHA("SHA3-512", "TEXT", { numRounds: info.itCount });
    sha3.update(info.password);
    return sha3.getHash("HEX");
  },
  hmac(hashedKey, info) {
    const sha3Hmac = new JsSHA('SHA3-512', 'TEXT');
    sha3Hmac.setHMACKey(hashedKey, 'TEXT');

    sha3Hmac.update(info.domain + '-' + info.username + '_' + info.salt);

    return sha3Hmac.getHMAC('HEX');
  },
  mapKeyToCharset(pwd, len, charset) {
    const key = new BaseN(generateAlphabet(charset)).encodeString(pwd)

    if (key.length < len) {
      window.alert('出问题了，请联系作者:)')
    }

    return key.slice(0, len)
  }
};

const view = {
  init(state) {
    view.removePanel();
    const text = view.preRender(tpl, state);

    const div = document.createElement('div');
    div.id = 'onepass-wrapper'
    div.innerHTML = text;

    view.bindEventHandlers(div);
    view.render(div);
  },
  showGeneratePass(pwd) {
    $('#op_keygen').textContent = pwd;
    const pElem = $('.cg p[hidden]');
    if (pElem) {
      pElem.removeAttribute('hidden');
    }
  },
  bindEventHandlers(context) {
    const $$ = (selector) => $(selector, context)
    $$('#toggler').addEventListener('click', function (event) {
      const triggerElem = event.target;
      const targetElem = $$('.optg');
      const isHidden = targetElem.getAttribute('hidden');

      if (isHidden !== null) {
        targetElem.removeAttribute('hidden');
        triggerElem.textContent = '−';
      } else {
        targetElem.setAttribute('hidden', '');
        triggerElem.textContent = '+';
      }
    })

    $$('#onePass').addEventListener('submit', function (event) {
      event.preventDefault();
      const formElements = event.target.elements
      const gen = octopus.generate({
        domain: formElements.domain.value,
        charset: parseInt(formElements.charset.value),
        username: formElements.name.value || '',
        password: formElements.pass.value,
        passOutLen: parseInt(formElements.passOutLen.value),
        itCount: parseInt(formElements.itCount.value),
        salt: formElements.salt.value || ''
      });
      view.showGeneratePass(gen);
    });

    $$('#op_clean').addEventListener('click', function () {
      $$('.cg p').setAttribute('hidden', '');
      $$('#op_keygen').textContent = '';
    });

    $$('a[title="close"]').addEventListener('click', function () {
      view.removePanel();
    });
  },
  preRender(text, state) {
    const passOutRange = state.passLenRange.map(
      val => `<option value="${val}" ${state.passOutLen === val ? 'selected="true"' : ''}>${val}</option>`)

    return text.replace('$VERSION$', state.version)
      .replace('$DOMAIN$', state.domain)
      .replace('$IT_COUNT$', state.itCount)
      .replace('$SALT$', state.salt)
      .replace('$PASS_OUT_RANGE$', passOutRange)
  },
  render(elem) {
    document.body.appendChild(elem);
  },
  removePanel() {
    const context = $('#onepass-wrapper')
    if (context)
      context.parentNode.removeChild(context)
  }
};

octopus.init(state);

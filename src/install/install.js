const $ = (selector, context = document) => context.querySelector(selector);

function getScript(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('load', function () {
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText)
      } else {
        reject(new Error('Script load failed'), xhr.responseText)
      }
    })

    xhr.open('GET', url)
    xhr.send()
  })
}

function objectToQuerystring(obj) {
  return Object.keys(obj).reduce(function (str, key, i) {
    let delimiter = (i === 0) ? '?' : '&';
    key = encodeURIComponent(key);
    let val = encodeURIComponent(obj[key]);
    return [str, delimiter, key, '=', val].join('');
  }, '');
}

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

const state = {
  bookmarkletSrc: ''
}

const octopus = {
  init() {
    getScript('./bundle.js')
      .then(function (source) {
        return getScript('./mobile-offline.html')
          .then(function (offlineSrc) {
            return [source, offlineSrc]
          })
      })
      .catch(function (err) {
        alert('小书签脚本加载出错，请刷新重试')
      })
      .then(function ([source, offlineSrc]) {
        state.bookmarkletSrc = source
        state.offlineSrc = offlineSrc
        view.init();
      })
  },
  genNewSalt(size = 32) {
    // base64 characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    const maxCharIndex = chars.length - 1;
    const salts = [];
    for (let i = size; i > 0; --i) {
      salts.push(chars[Math.floor(Math.random() * maxCharIndex)]);
    }
    return salts.join('');
  },
  generate(source, formData) {
    return source
      .replace(/passOutLen:.+?,/, `passOutLen:${formData.passOutLen},`)
      .replace(/charset:.+?,/, `charset:${formData.charset},`)
      .replace(/itCount:.+?,/, `itCount:${formData.itCount},`)
      .replace(/salt:\s*?['"][^'"]+['"]/, `salt:${JSON.stringify(formData.salt)}`)
  }
};

const view = {
  init() {
    view.bindEventHandlers()
    view.updateLinks($('#install-form'))
  },
  bindEventHandlers() {
    $('#change-salt').addEventListener('click', function () {
      $('#salt').value = octopus.genNewSalt()
    });

    $('#install-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const formElements = event.target.elements
      view.updateLinks(formElements)
    });
  },
  updateLinks(formElements) {
    const data = {
      charset: parseInt(formElements.charset.value),
      passOutLen: parseInt(formElements.passLen.value),
      itCount: parseInt(formElements.iteration.value),
      salt: formElements.salt.value || ''
    }
    const bookmarkletSrc = octopus.generate(state.bookmarkletSrc, data);

    $('#bookmarklet').setAttribute('href', `javascript:${bookmarkletSrc}`)

    const offlineSrc = octopus.generate(state.offlineSrc, data)

    $('#mobile_offline').setAttribute('href', `data:text/html;charset=utf-8;base64,${utf8_to_b64(offlineSrc)}`)

    $('#mobile').setAttribute('href', `mobile.html${objectToQuerystring(data)}`)
  }
}

octopus.init()

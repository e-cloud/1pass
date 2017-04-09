const $ = (selector, context = document) => context.querySelector(selector);

function getScript() {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('load', function () {
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText)
      } else {
        reject(new Error('Script load failed'), xhr.responseText)
      }
    })

    xhr.open('GET', './bundle.js')
    xhr.send()
  })
}

const state = {
  source: ''
}

const octopus = {
  init() {
    getScript()
      .then(function (source) {
        state.source = source
        view.init();

      }, function (err) {
        alert('小书签脚步加载出错，请刷新重试')
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
  generate(formData) {
    return state.source
      .replace(/passOutLen:.+?,/, `passOutLen:${formData.passLen},`)
      .replace(/charset:.+?,/, `charset:${formData.charset},`)
      .replace(/itCount:.+?,/, `itCount:${formData.iteration},`)
      .replace(/salt:.+?}/, `salt:"${formData.salt}"}`)
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
    const data = octopus.generate({
      charset: parseInt(formElements.charset.value),
      passLen: parseInt(formElements.passLen.value),
      iteration: parseInt(formElements.iteration.value),
      salt: formElements.salt.value || ''
    });

    $('#bookmarklet').setAttribute('href', `javascript:${data}`)
  }
}

octopus.init()

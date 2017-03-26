import {
  template
} from './lib/doT'
import tpl from './template.html'

const $ = document.querySelector.bind(document);

const state = {
  passLenRange: new Array(27).fill(0).map((v, k) => k + 6),
  passOutLen: /*$predefinedOutLen$*/ 10,
  charset: /*$predefinedCharset$*/ 94,
  itCount: /*$predefinedItCount$*/ 100,
  salt: /*$predefinedSalt$*/ 's1dswe54s49v21ef6s5d4f921s65f1ds'
};

const octopus = {

};

const view = {
  init() {
    this.render();
  },
  render() {
    const text = template(tpl)(state);

    const div = document.createElement('div');
    div.innerHTML = text;

    document.body.appendChild(div);
  }
};

view.init();

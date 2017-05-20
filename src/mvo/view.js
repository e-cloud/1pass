/* eslint-disable radix */
import tpl from '../bookmarklet.html'
import selectText, { copyToClipboard } from '../lib/select-text'
import * as octopus from './octopus'

const doc = document

const $ = (selector, context = doc) => context.querySelector(selector)

export function init(state) {
  removePanel()
  const text = preRender(tpl, state)

  const div = doc.createElement('div')
  div.id = 'onepass-wrapper'
  div.innerHTML = text

  $('#salt', div).value = state.salt

  bindEventHandlers(div)
  bindDragAndDrop(div)
  render(div)
}

export function initMobile(state) {
  const div = doc.querySelector('.onePassPanel')
  div.id = 'onepass-wrapper'
  div.innerHTML = preRender(div.innerHTML, state)
  $('#salt', div).value = state.salt
  bindEventHandlers(div)
}

function showGeneratePass(pwd) {
  $('#op_keygen').textContent = pwd
  const pElem = $('.cg p[hidden]')
  if (pElem) {
    pElem.removeAttribute('hidden')
  }
}

function bindEventHandlers(context) {
  const $$ = (selector) => $(selector, context)
  $$('#toggler').addEventListener('click', function (event) {
    const triggerElem = event.target
    const targetElem = $$('.optg')
    const isHidden = targetElem.getAttribute('hidden')

    if (isHidden !== null) {
      targetElem.removeAttribute('hidden')
      triggerElem.textContent = '−'
    } else {
      targetElem.setAttribute('hidden', '')
      triggerElem.textContent = '+'
    }
  })

  $$('#onePass').addEventListener('submit', function (event) {
    event.preventDefault()
    const formElements = event.target.elements
    const gen = octopus.generate({
      domain$: formElements.domain.value,
      charset$: parseInt(formElements.charset.value),
      username$: formElements.name.value || '',
      password$: formElements.pass.value,
      passOutLen$: parseInt(formElements.passOutLen.value),
      itCount$: parseInt(formElements.itCount.value),
      salt$: formElements.salt.value || ''
    })
    showGeneratePass(gen)
  })

  $$('#op_clean').addEventListener('click', function () {
    $$('.cg p').setAttribute('hidden', '')
    $$('#op_keygen').textContent = ''
  })

  $$('a[title="close"]').addEventListener('click', function () {
    removePanel()
  })

  let timer = null

  $$('#op_keygen').addEventListener('click', function (event) {
    selectText(event.target)
    if (copyToClipboard()) {
      $$('#op_toastr').removeAttribute('hidden')
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        $$('#op_toastr').setAttribute('hidden', '')
        timer = null
      }, 3000)
    }
  })
}

function bindDragAndDrop(div) {
  let eX
  let eY
  let startX
  let startY
  let moveListener
  div.addEventListener('mousedown', function (event) {
    if (event.ctrlKey) {
      div.style.cursor = 'move'
      doc.removeEventListener('mousemove', moveListener)
      const target = div.lastElementChild
      startX = event.clientX
      startY = event.clientY
      eX = target.offsetLeft
      eY = target.offsetTop

      doc.addEventListener('mousemove', moveListener = function (mvevent) {
        const currentX = mvevent.clientX
        const currentY = mvevent.clientY
        target.style.left = `${currentX - startX + eX}px`
        target.style.top = `${currentY - startY + eY}px`
      })

      return false
    }
  })

  doc.addEventListener('mouseup', function () {
    doc.removeEventListener('mousemove', moveListener)
    div.style.cursor = 'auto'
  })
}

function preRender(text, state) {
  const passOutRange = state.passLenRange.map((val) =>
    `<option value="${val}" ${state.passOutLen === val ? 'selected="true"' : ''}>${val}</option>`)

  return text.replace('$VERSION$', state.version)
    .replace('$DOMAIN$', state.domain)
    .replace('$IT_COUNT$', state.itCount)
    .replace('$PASS_OUT_RANGE$', passOutRange)
}

function render(elem) {
  doc.body.appendChild(elem)
}

function removePanel() {
  const context = $('#onepass-wrapper')
  if (context) context.parentNode.removeChild(context)
}

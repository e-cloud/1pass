import model from '../mvo/model'
import * as octopus from '../mvo/octopus'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./sw.js')
           .then(function() { console.log('Service Worker Registered'); });
}

octopus.initMobile(model)

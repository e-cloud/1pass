!function(){'use strict';function t(t){return new Promise(function(e,n){var r=new XMLHttpRequest;r.addEventListener('load',function(){200===r.status||304===r.status?e(r.responseText):n(new Error('Script load failed'),r.responseText)}),r.open('GET',t),r.send()})}function e(t){return Object.keys(t).reduce(function(e,n,r){var a=0===r?'?':'&',i=encodeURIComponent(n);return[e,a,i,'=',encodeURIComponent(t[i])].join('')},'')}function n(t){return window.btoa(unescape(encodeURIComponent(t)))}var r=function(){function t(t,e){var n=[],r=!0,a=!1,i=void 0;try{for(var o,u=t[Symbol.iterator]();!(r=(o=u.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{!r&&u.return&&u.return()}finally{if(a)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),a=function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:document).querySelector(t)},i={bookmarkletSrc:''},o={init:function(){t('./bundle.js').then(function(e){return t('./mobile-offline.html').then(function(t){return[e,t]})}).catch(function(){alert('小书签脚本加载出错，请刷新重试')}).then(function(t){var e=r(t,2),n=e[0],a=e[1];i.bookmarkletSrc=n,i.offlineSrc=a,u.init()})},genNewSalt:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,e='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),n=e.length-1,r=[],a=t;a>0;--a)r.push(e[Math.floor(Math.random()*n)]);return r.join('')},generate:function(t,e){return t.replace(/passOutLen:.+?,/,'passOutLen:'+e.passOutLen+',').replace(/charset:.+?,/,'charset:'+e.charset+',').replace(/itCount:.+?,/,'itCount:'+e.itCount+',').replace(/salt:\s*?['"][^'"]+['"]/,'salt:'+JSON.stringify(e.salt))}},u={init:function(){u.bindEventHandlers(),u.updateLinks(a('#install-form'))},bindEventHandlers:function(){a('#change-salt').addEventListener('click',function(){a('#salt').value=o.genNewSalt()}),a('#install-form').addEventListener('submit',function(t){t.preventDefault();var e=t.target.elements;u.updateLinks(e)})},updateLinks:function(t){var r={charset:parseInt(t.charset.value),passOutLen:parseInt(t.passLen.value),itCount:parseInt(t.iteration.value),salt:t.salt.value||''},u=o.generate(i.bookmarkletSrc,r);a('#bookmarklet').setAttribute('href','javascript:'+u);var s=o.generate(i.offlineSrc,r);a('#mobile_offline').setAttribute('href','data:text/html;charset=utf-8;base64,'+n(s)),a('#mobile').setAttribute('href','mobile.html'+e(r))}};o.init()}();
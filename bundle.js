!function(){'use strict';function e(){for(var e=0,t=location.hostname,n=t.split('.'),r='_gd'+(new Date).getTime();e<n.length-1&&-1===document.cookie.indexOf(r+'='+r);)e++,t=n.slice(-1-e).join('.'),document.cookie=r+'='+r+';domain='+t+';';return document.cookie=r+'=;expires='+new Date(0)+';domain='+t+';',t}function t(e){switch(e){case 10:return k;case 62:return T+x+k;case 64:return T+x+k+'+/';case 94:return new Array(94).fill(0).map(function(e,t){return String.fromCharCode(t+33)}).join('')}}function n(e,t){for(var n=[],r=0,o=1;r<t;r++,o*=e)n[r]=o;return n}function r(e,t){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2,r=0,a=0,i=o(e,n),s=Math.log(n)/Math.log(e),u=0,l=i;l<=t;l++){var c=Math.ceil(l*s),f=l/c;f>u&&(u=f,r=l,a=c)}return{bitsCount:r,charsCountInBits:a}}function o(e,t){return Math.floor(Math.log(e)/Math.log(t))}function a(e){for(var t=[],n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t.push(r):r<2048?t.push(192|r>>6,128|63&r):r<55296||r>=57344?t.push(224|r>>12,128|r>>6&63,128|63&r):(n++,r=65536+((1023&r)<<10|1023&e.charCodeAt(n)),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r))}return t}function i(e){var t=void 0,n=void 0,r=void 0,o=void 0,a='',i=e.length;for(t=0;t<i;)switch((n=e[t++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:a+=String.fromCharCode(n);break;case 12:case 13:r=e[t++],a+=String.fromCharCode((31&n)<<6|63&r);break;case 14:r=e[t++],o=e[t++],a+=String.fromCharCode((15&n)<<12|(63&r)<<6|(63&o)<<0)}return a}function s(e,t,n){var r=0,o=Math.floor(t/8),a=t%8,i=Math.min(n,8-a);if(0!==i){r=(e[o]>>8-i-a&L[7-a])<<n-i,o+=Math.floor((a+i)/8),a=(a+i)%8;var s=n-i;for(s>8&&(s=8);s>0;)i+=s,r|=e[o]>>8-s<<n-i,o+=Math.floor((a+s)/8),a=(a+s)%8,(s=n-i)>8&&(s=8)}return r}function u(e,t,n,r){var o=Math.floor(n/8),a=n%8,i=Math.min(r,8-a);if(0!==i){var s=r+a-8,u=s>=0?t>>s:t<<-s;u&=L[7-a],u&=255,e[o]|=u,o+=Math.floor((a+i)/8),a=(a+i)%8;var l=r-i;for(l>8&&(l=8);l>0;){i+=l;var c=t>>r-i<<8-l&255;e[o]|=c,o+=Math.floor((a+l)/8),a=(a+l)%8,l=r-i,l>8&&(l=8)}}}function l(e){var t=void 0,n=void 0,r=document;window.getSelection?(n=window.getSelection(),t=r.createRange(),t.selectNodeContents(e),n.removeAllRanges(),n.addRange(t)):r.body.createTextRange&&(t=r.body.createTextRange(),t.moveToElementText(e),t.select())}function c(){try{document.execCommand('copy')}catch(e){return alert('please press Ctrl/Cmd+C to copy'),!1}return!0}function f(e){g();var t=v(R,e),n=U.createElement('div');n.id='onepass-wrapper',n.innerHTML=t,F('#salt',n).value=e.salt,d(n),p(n),b(n)}function h(e){F('#op_keygen').textContent=e;var t=F('.cg p[hidden]');t&&t.removeAttribute('hidden')}function d(e){var t=function(t){return F(t,e)};t('#toggler').addEventListener('click',function(e){var n=e.target,r=t('.optg');null!==r.getAttribute('hidden')?(r.removeAttribute('hidden'),n.textContent='−'):(r.setAttribute('hidden',''),n.textContent='+')}),t('#onePass').addEventListener('submit',function(e){e.preventDefault();var t=e.target.elements;h(A({domain$:t.domain.value,charset$:parseInt(t.charset.value),username$:t.name.value||'',password$:t.pass.value,passOutLen$:parseInt(t.passOutLen.value),itCount$:parseInt(t.itCount.value),salt$:t.salt.value||''}))}),t('#op_clean').addEventListener('click',function(){t('.cg p').setAttribute('hidden',''),t('#op_keygen').textContent=''}),t('a[title="close"]').addEventListener('click',function(){g()});var n=null;t('#op_keygen').addEventListener('click',function(e){l(e.target),c()&&(t('#op_toastr').removeAttribute('hidden'),n&&clearTimeout(n),n=setTimeout(function(){t('#op_toastr').setAttribute('hidden',''),n=null},3e3))})}function p(e){var t=void 0,n=void 0,r=void 0,o=void 0,a=void 0;e.addEventListener('mousedown',function(i){if(i.ctrlKey){e.style.cursor='move',U.removeEventListener('mousemove',a);var s=e.lastElementChild;return r=i.clientX,o=i.clientY,t=s.offsetLeft,n=s.offsetTop,U.addEventListener('mousemove',a=function(e){var a=e.clientX,i=e.clientY;s.style.left=a-r+t+'px',s.style.top=i-o+n+'px'}),!1}}),U.addEventListener('mouseup',function(){U.removeEventListener('mousemove',a),e.style.cursor='auto'})}function v(e,t){var n=t.passLenRange.map(function(e){return'<option value="'+e+'" '+(t.passOutLen===e?'selected="true"':'')+'>'+e+'</option>'});return e.replace('$VERSION$',t.version).replace('$DOMAIN$',t.domain).replace('$IT_COUNT$',t.itCount).replace('$PASS_OUT_RANGE$',n)}function b(e){U.body.appendChild(e)}function g(){var e=F('#onepass-wrapper');e&&e.parentNode.removeChild(e)}function m(e,t){var n=new C('SHA3-512','TEXT');return n.setHMACKey(e,'TEXT'),n.update(t.domain$+'-'+t.username$+'_'+t.salt$),n.getHMAC('HEX')}function w(e){var t=new C('SHA3-512','TEXT',{numRounds:e.itCount$});return t.update(e.password$),t.getHash('HEX')}function E(e,n,r){var o=new H(t(r)).encodeString(e);return o.length<n&&window.alert('出问题了，请联系作者:)'),o.slice(0,n)}function A(e){return E(m(w(e),e),e.passOutLen$,e.charset$)}for(var y={version:'0.4.0',domain:'',passLenRange:new Array(123).fill(0).map(function(e,t){return t+6}),passOutLen:16,charset:94,itCount:100,salt:'I am a dummy salt. Do not use me.'},C=('undefined'!=typeof window?window:'undefined'!=typeof global?global:'undefined'!=typeof self&&self,function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e,t){!function(n){function r(e,t,n){var r,o,f,h,v,b,g,m,w,E=0,A=[],y=0,C=!1,k=[],x=[],T=!1,L=!1,B=-1;if(n=n||{},r=n.encoding||'UTF8',(w=n.numRounds||1)!==parseInt(w,10)||1>w)throw Error('numRounds must a integer >= 1');if(0!==e.lastIndexOf('SHA3-',0)&&0!==e.lastIndexOf('SHAKE',0))throw Error('Chosen SHA variant is not supported');var M=6;if(b=p,m=function(e){var t,n=[];for(t=0;5>t;t+=1)n[t]=e[t].slice();return n},B=1,'SHA3-224'===e)v=1152,h=224;else if('SHA3-256'===e)v=1088,h=256;else if('SHA3-384'===e)v=832,h=384;else if('SHA3-512'===e)v=576,h=512;else if('SHAKE128'===e)v=1344,h=-1,M=31,L=!0;else{if('SHAKE256'!==e)throw Error('Chosen SHA variant is not supported');v=1088,h=-1,M=31,L=!0}g=function(e,t,n,r,o){n=v;var a,i=M,s=[],u=n>>>5,l=0,c=t>>>5;for(a=0;a<c&&t>=n;a+=u)r=p(e.slice(a,a+u),r),t-=n;for(e=e.slice(a),t%=n;e.length<u;)e.push(0);for(a=t>>>3,e[a>>2]^=i<<a%4*8,e[u-1]^=2147483648,r=p(e,r);32*s.length<o&&(e=r[l%5][l/5|0],s.push(e.b),!(32*s.length>=o));)s.push(e.a),0==64*(l+=1)%n&&p(null,r);return s},f=c(t,r,B),o=d(e),this.setHMACKey=function(t,n,a){var i;if(!0===C)throw Error('HMAC key already set');if(!0===T)throw Error('Cannot set HMAC key after calling update');if(!0===L)throw Error('SHAKE is not supported for HMAC');if(r=(a||{}).encoding||'UTF8',n=c(n,r,B)(t),t=n.binLen,n=n.value,i=v>>>3,a=i/4-1,i<t/8){for(n=g(n,t,0,d(e),h);n.length<=a;)n.push(0);n[a]&=4294967040}else if(i>t/8){for(;n.length<=a;)n.push(0);n[a]&=4294967040}for(t=0;t<=a;t+=1)k[t]=909522486^n[t],x[t]=1549556828^n[t];o=b(k,o),E=v,C=!0},this.update=function(e){var t,n,r,a=0,i=v>>>5;for(t=f(e,A,y),e=t.binLen,n=t.value,t=e>>>5,r=0;r<t;r+=i)a+v<=e&&(o=b(n.slice(r,r+i),o),a+=v);E+=a,A=n.slice(a>>>5),y=e%v,T=!0},this.getHash=function(t,n){var r,c,f,p;if(!0===C)throw Error('Cannot call getHash after setting HMAC key');if(f=l(n),!0===L){if(-1===f.shakeLen)throw Error('shakeLen must be specified in options');h=f.shakeLen}switch(t){case'HEX':r=function(e){return a(e,h,B,f)};break;case'B64':r=function(e){return i(e,h,B,f)};break;case'BYTES':r=function(e){return s(e,h,B)};break;case'ARRAYBUFFER':try{c=new ArrayBuffer(0)}catch(e){throw Error('ARRAYBUFFER not supported by this environment')}r=function(e){return u(e,h,B)};break;default:throw Error('format must be HEX, B64, BYTES, or ARRAYBUFFER')}for(p=g(A.slice(),y,E,m(o),h),c=1;c<w;c+=1)!0===L&&0!=h%32&&(p[p.length-1]&=16777215>>>24-h%32),p=g(p,h,0,d(e),h);return r(p)},this.getHMAC=function(t,n){var r,c,f,p;if(!1===C)throw Error('Cannot call getHMAC without first setting HMAC key');switch(f=l(n),t){case'HEX':r=function(e){return a(e,h,B,f)};break;case'B64':r=function(e){return i(e,h,B,f)};break;case'BYTES':r=function(e){return s(e,h,B)};break;case'ARRAYBUFFER':try{r=new ArrayBuffer(0)}catch(e){throw Error('ARRAYBUFFER not supported by this environment')}r=function(e){return u(e,h,B)};break;default:throw Error('outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER')}return c=g(A.slice(),y,E,m(o),h),p=b(x,d(e)),p=g(c,h,v,p,h),r(p)}}function o(e,t){this.a=e,this.b=t}function a(e,t,n,r){var o='';t/=8;var a,i,s;for(s=-1===n?3:0,a=0;a<t;a+=1)i=e[a>>>2]>>>8*(s+a%4*n),o+='0123456789abcdef'.charAt(i>>>4&15)+'0123456789abcdef'.charAt(15&i);return r.outputUpper?o.toUpperCase():o}function i(e,t,n,r){var o,a,i,s,u='',l=t/8;for(s=-1===n?3:0,o=0;o<l;o+=3)for(a=o+1<l?e[o+1>>>2]:0,i=o+2<l?e[o+2>>>2]:0,i=(e[o>>>2]>>>8*(s+o%4*n)&255)<<16|(a>>>8*(s+(o+1)%4*n)&255)<<8|i>>>8*(s+(o+2)%4*n)&255,a=0;4>a;a+=1)u+=8*o+6*a<=t?'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(i>>>6*(3-a)&63):r.b64Pad;return u}function s(e,t,n){var r='';t/=8;var o,a,i;for(i=-1===n?3:0,o=0;o<t;o+=1)a=e[o>>>2]>>>8*(i+o%4*n)&255,r+=String.fromCharCode(a);return r}function u(e,t,n){t/=8;var r,o,a,i=new ArrayBuffer(t);for(a=new Uint8Array(i),o=-1===n?3:0,r=0;r<t;r+=1)a[r]=e[r>>>2]>>>8*(o+r%4*n)&255;return i}function l(e){var t={outputUpper:!1,b64Pad:'=',shakeLen:-1};if(e=e||{},t.outputUpper=e.outputUpper||!1,!0===e.hasOwnProperty('b64Pad')&&(t.b64Pad=e.b64Pad),!0===e.hasOwnProperty('shakeLen')){if(0!=e.shakeLen%8)throw Error('shakeLen must be a multiple of 8');t.shakeLen=e.shakeLen}if('boolean'!=typeof t.outputUpper)throw Error('Invalid outputUpper formatting option');if('string'!=typeof t.b64Pad)throw Error('Invalid b64Pad formatting option');return t}function c(e,t,n){switch(t){case'UTF8':case'UTF16BE':case'UTF16LE':break;default:throw Error('encoding must be UTF8, UTF16BE, or UTF16LE')}switch(e){case'HEX':e=function(e,t,r){var o,a,i,s,u,l,c=e.length;if(0!=c%2)throw Error('String of HEX type must be in byte increments');for(t=t||[0],r=r||0,u=r>>>3,l=-1===n?3:0,o=0;o<c;o+=2){if(a=parseInt(e.substr(o,2),16),isNaN(a))throw Error('String of HEX type contains invalid characters');for(s=(o>>>1)+u,i=s>>>2;t.length<=i;)t.push(0);t[i]|=a<<8*(l+s%4*n)}return{value:t,binLen:4*c+r}};break;case'TEXT':e=function(e,r,o){var a,i,s,u,l,c,f,h,d=0;if(r=r||[0],o=o||0,l=o>>>3,'UTF8'===t)for(h=-1===n?3:0,s=0;s<e.length;s+=1)for(a=e.charCodeAt(s),i=[],128>a?i.push(a):2048>a?(i.push(192|a>>>6),i.push(128|63&a)):55296>a||57344<=a?i.push(224|a>>>12,128|a>>>6&63,128|63&a):(s+=1,a=65536+((1023&a)<<10|1023&e.charCodeAt(s)),i.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|63&a)),u=0;u<i.length;u+=1){for(f=d+l,c=f>>>2;r.length<=c;)r.push(0);r[c]|=i[u]<<8*(h+f%4*n),d+=1}else if('UTF16BE'===t||'UTF16LE'===t)for(h=-1===n?2:0,i='UTF16LE'===t&&1!==n||'UTF16LE'!==t&&1===n,s=0;s<e.length;s+=1){for(a=e.charCodeAt(s),!0===i&&(u=255&a,a=u<<8|a>>>8),f=d+l,c=f>>>2;r.length<=c;)r.push(0);r[c]|=a<<8*(h+f%4*n),d+=2}return{value:r,binLen:8*d+o}};break;case'B64':e=function(e,t,r){var o,a,i,s,u,l,c,f,h=0;if(-1===e.search(/^[a-zA-Z0-9=+\/]+$/))throw Error('Invalid character in base-64 string');if(a=e.indexOf('='),e=e.replace(/\=/g,''),-1!==a&&a<e.length)throw Error('Invalid \'=\' found in base-64 string');for(t=t||[0],r=r||0,l=r>>>3,f=-1===n?3:0,a=0;a<e.length;a+=4){for(u=e.substr(a,4),i=s=0;i<u.length;i+=1)o='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(u[i]),s|=o<<18-6*i;for(i=0;i<u.length-1;i+=1){for(c=h+l,o=c>>>2;t.length<=o;)t.push(0);t[o]|=(s>>>16-8*i&255)<<8*(f+c%4*n),h+=1}}return{value:t,binLen:8*h+r}};break;case'BYTES':e=function(e,t,r){var o,a,i,s,u,l;for(t=t||[0],r=r||0,i=r>>>3,l=-1===n?3:0,a=0;a<e.length;a+=1)o=e.charCodeAt(a),u=a+i,s=u>>>2,t.length<=s&&t.push(0),t[s]|=o<<8*(l+u%4*n);return{value:t,binLen:8*e.length+r}};break;case'ARRAYBUFFER':try{e=new ArrayBuffer(0)}catch(e){throw Error('ARRAYBUFFER not supported by this environment')}e=function(e,t,r){var o,a,i,s,u,l;for(t=t||[0],r=r||0,a=r>>>3,u=-1===n?3:0,l=new Uint8Array(e),o=0;o<e.byteLength;o+=1)s=o+a,i=s>>>2,t.length<=i&&t.push(0),t[i]|=l[o]<<8*(u+s%4*n);return{value:t,binLen:8*e.byteLength+r}};break;default:throw Error('format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER')}return e}function f(e,t){return 32<t?(t-=32,new o(e.b<<t|e.a>>>32-t,e.a<<t|e.b>>>32-t)):0!==t?new o(e.a<<t|e.b>>>32-t,e.b<<t|e.a>>>32-t):e}function h(e,t){return new o(e.a^t.a,e.b^t.b)}function d(e){var t=[];if(0!==e.lastIndexOf('SHA3-',0)&&0!==e.lastIndexOf('SHAKE',0))throw Error('No SHA variants supported');for(e=0;5>e;e+=1)t[e]=[new o(0,0),new o(0,0),new o(0,0),new o(0,0),new o(0,0)];return t}function p(e,t){var n,r,a,i,s=[],u=[];if(null!==e)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=h(t[(r>>>1)%5][(r>>>1)/5|0],new o(e[r+1],e[r]));for(n=0;24>n;n+=1){for(i=d('SHA3-'),r=0;5>r;r+=1){a=t[r][0];var l=t[r][1],c=t[r][2],p=t[r][3],g=t[r][4];s[r]=new o(a.a^l.a^c.a^p.a^g.a,a.b^l.b^c.b^p.b^g.b)}for(r=0;5>r;r+=1)u[r]=h(s[(r+4)%5],f(s[(r+1)%5],1));for(r=0;5>r;r+=1)for(a=0;5>a;a+=1)t[r][a]=h(t[r][a],u[r]);for(r=0;5>r;r+=1)for(a=0;5>a;a+=1)i[a][(2*r+3*a)%5]=f(t[r][a],v[r][a]);for(r=0;5>r;r+=1)for(a=0;5>a;a+=1)t[r][a]=h(i[r][a],new o(~i[(r+1)%5][a].a&i[(r+2)%5][a].a,~i[(r+1)%5][a].b&i[(r+2)%5][a].b));t[0][0]=h(t[0][0],b[n])}return t}var v,b;b=[new o(0,1),new o(0,32898),new o(2147483648,32906),new o(2147483648,2147516416),new o(0,32907),new o(0,2147483649),new o(2147483648,2147516545),new o(2147483648,32777),new o(0,138),new o(0,136),new o(0,2147516425),new o(0,2147483658),new o(0,2147516555),new o(2147483648,139),new o(2147483648,32905),new o(2147483648,32771),new o(2147483648,32770),new o(2147483648,128),new o(0,32778),new o(2147483648,2147483658),new o(2147483648,2147516545),new o(2147483648,32896),new o(0,2147483649),new o(2147483648,2147516424)],v=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]],e.exports&&(e.exports=r),t=r}()})),k='0123456789',x='abcdefghijklmnopqrstuvwxyz',T='ABCDEFGHIJKLMNOPQRSTUVWXYZ',L=[],B=0;B<8;B++)L[B]=Math.pow(2,B+1)-1;var M=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},S=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,'value'in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),H=function(){function e(t){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:64;M(this,e),this.alphabet=t,this.alphabetLen=t.length,this.blockMaxBitsCount=o;var a=r(this.alphabetLen,this.blockMaxBitsCount,2);this.blockBitsCount=a.bitsCount,this.blockCharsCount=a.charsCountInBits,this.powN=n(this.alphabetLen,this.blockCharsCount),this.inverseAlphabet={};for(var i=0;i<this.alphabetLen;i++)this.inverseAlphabet[this.alphabet[i]]=i}return S(e,[{key:'encodeString',value:function(e){return this.encodeBytes(a(e))}},{key:'encodeBytes',value:function(e){if(!e||0===e.length)return'';for(var t=this.blockBitsCount,n=this.blockCharsCount,r=Math.floor(8*e.length/t)*t,o=8*e.length-r,a=Math.floor(r*n/t),i=Math.floor((o*n+t-1)/t),u=Math.floor(a/n),l=[],c=0;c<u;c++)this.encodeBlock(e,l,c,t,n);if(0!==o){var f=s(e,r,o);this.bitsToChars(l,a,i,f)}return l.join('')}},{key:'encodeBlock',value:function(e,t,n,r,o){var a=n*o,i=n*r,u=s(e,i,r);this.bitsToChars(t,a,o,u)}},{key:'bitsToChars',value:function(e,t,n,r){for(var o=r,a=0;a<n;a++)e[t+a]=this.alphabet[o%this.alphabetLen],o=Math.floor(o/this.alphabetLen)}},{key:'decodeToString',value:function(e){return i(this.decodeToBytes(e))}},{key:'decodeToBytes',value:function(e){if(!e||0===e.length)return[];var t=this.blockBitsCount,n=this.blockCharsCount,r=8*Math.floor((Math.floor((e.length-1)*t/n)+8)/8),o=Math.floor(r/t)*t,a=r-o,i=Math.floor(o*n/t),s=Math.floor((a*n+t-1)/t),l=this.charsToBits(e,i,s);(a>=32?0:l>>a!=0)&&(r+=8,o=Math.floor(r/t)*t,a=r-o,i=Math.floor(o*n/t),s=Math.floor((a*n+t-1)/t));for(var c=Math.floor(i/n),f=[],h=0;h<c;h++)this.decodeBlock(e,f,h,t,n);if(0!==s){u(f,this.charsToBits(e,i,s),o,a)}return f}},{key:'decodeBlock',value:function(e,t,n,r,o){var a=n*o,i=n*r;u(t,this.charsToBits(e,a,o),i,r)}},{key:'charsToBits',value:function(e,t,n){for(var r=0,o=0;o<n;o++){r+=this.inverseAlphabet[e[t+o]]*this.powN[o]}return r}}]),e}(),R='<style>.onePassPanel *{box-sizing:border-box;margin:0}.onePassPanel [hidden]{display:none!important}.onePassPanel{position:fixed;z-index:999999;top:0;left:0;border-radius:10px;padding:5px;background-color:#eee;box-shadow:0 0 5px #aaa;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.opp-title{float:left}.opp-ctrl-btns{float:right}.opp-ctrl-btns a{cursor:pointer;margin:0 3px}.onePassPanel hr{clear:both;margin:3px 0}.fg{padding:2px 0}.fg label{display:inline-block;text-align:right;width:6em;margin-right:.5em;font-size:16px}.onePassPanel .fg input,.onePassPanel .fg select{border:0;width:12em;height:1.5em;background-color:#fff;margin-right:.5em;border-radius:4px;font-size:16px;padding:0 5px;display:inline-block}.cg{text-align:center;margin-top:5px}.cg p{max-width:16em;word-break:break-all;margin:5px auto;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}#op_toastr{position:absolute;top:1em;left:0;width:100%;text-align:center}#op_toastr span{background-color:#434343;padding:5px 10px;border-radius:5px;color:#fff}</style><div class="onePassPanel"><header><div class="opp-title"><span>OnePass</span> <span>v$VERSION$</span></div><div class="opp-ctrl-btns"><a title="help" href="https://github.com/e-cloud/1pass" target="_blank">?</a> <a id="toggler" title="expand/fold">+</a> <a title="close">×</a></div></header><hr><form id="onePass"><div class="fg"><label for="domain">域名(*)</label> <input id="domain" value="$DOMAIN$" required></div><div class="fg"><label for="name">用户名</label> <input id="name" value=""></div><div class="fg"><label for="pass">主密码(*)</label> <input id="pass" type="password" value="" pattern=".{6,}" maxlength="10086" autocomplete="off" placeholder="至少6位" required></div><div class="fg"><label for="passOutLen">密码长度</label> <select id="passOutLen" required>$PASS_OUT_RANGE$</select></div><div class="optg" hidden><div class="fg"><label for="charset">密码字符集</label> <select id="charset" required><option value="94">所有可打印字符</option><option value="64">字母、数字以及 + 和 /</option><option value="62">字母和数字</option><option value="10">只含数字</option></select></div><div class="fg"><label for="itCount">迭代次数</label> <input id="itCount" value="$IT_COUNT$" type="number" min="0" max="9999" required></div><div class="fg"><label for="salt">盐(salt)</label> <input id="salt" value="$SALT$"></div></div><div class="cg"><button type="submit">生成密码</button> <button type="button" id="op_clean">清除密码</button><p hidden><output id="op_keygen"></output></p><div id="op_toastr" hidden><span>密码已复制到剪贴板</span></div></div></form></div>',U=document,F=function(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:U).querySelector(e)};y.domain=function(){var t=e(),n=t.split('.');return n.length>2?(n.pop(),n.join('.')):t}(),function(e){f(e)}(y)}();
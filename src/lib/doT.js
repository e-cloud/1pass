// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

const version = "1.1.1"
const templateSettings = {
  evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode: /\{\{!([\s\S]+?)\}\}/g,
  use: /\{\{#([\s\S]+?)\}\}/g,
  useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
  define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  defineParams: /^\s*([\w$]+):([\s\S]+)/,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: "it",
  strip: true,
  append: true,
  selfcontained: false,
  doNotSkipEncoded: false
}

export function encodeHTMLSource(doNotSkipEncoded) {
  const encodeHTMLRules = {
    "&": "&#38;",
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "/": "&#47;"
  }
  const matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
  return function (code) {
    return code ? code.toString().replace(matchHTML, function (m) {
      return encodeHTMLRules[m] || m;
    }) : "";
  };
};

const startend = {
  append: {
    start: "'+(",
    end: ")+'",
    startencode: "'+eh("
  },
  split: {
    start: "';o+=(",
    end: ");o+='",
    startencode: "';o+=eh("
  }
}
const skip = /$^/;

function resolveDefs(c, block, def) {
  return ((typeof block === "string") ? block : block.toString())
    .replace(c.define || skip, function (m, code, assign, value) {
      if (code.indexOf("def.") === 0) {
        code = code.substring(4);
      }
      if (!(code in def)) {
        if (assign === ":") {
          if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
            def[code] = {
              arg: param,
              text: v
            };
          });
          if (!(code in def)) def[code] = value;
        } else {
          new Function("def", "def['" + code + "']=" + value)(def);
        }
      }
      return "";
    })
    .replace(c.use || skip, function (m, code) {
      if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
        if (def[d] && def[d].arg && param) {
          var rw = (d + ":" + param).replace(/'|\\/g, "_");
          def.__exp = def.__exp || {};
          def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
          return s + "def.__exp['" + rw + "']";
        }
      });
      const v = new Function("def", "return " + code)(def);
      return v ? resolveDefs(c, v, def) : v;
    });
}

function unescape(code) {
  return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
}

export function template(tmpl, config, def) {
  config = config || templateSettings;
  const cse = config.append ? startend.append : startend.split
  let needhtmlencode
  let sid = 0
  let indv
  let str = (config.use || config.define) ? resolveDefs(config, tmpl, def || {}) : tmpl;

  str = ("var o='" + (config.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
        .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str)
      .replace(/'|\\/g, "\\$&")
      .replace(config.interpolate || skip, function (m, code) {
        return cse.start + unescape(code) + cse.end;
      })
      .replace(config.encode || skip, function (m, code) {
        needhtmlencode = true;
        return cse.startencode + unescape(code) + cse.end;
      })
      .replace(config.conditional || skip, function (m, elsecase, code) {
        return elsecase ?
          (code ? "';}else if(" + unescape(code) + "){o+='" : "';}else{o+='") :
          (code ? "';if(" + unescape(code) + "){o+='" : "';}o+='");
      })
      .replace(config.iterate || skip, function (m, iterate, vname, iname) {
        if (!iterate) return "';} } o+='";
        sid += 1;
        indv = iname || "i" + sid;
        iterate = unescape(iterate);
        return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){" +
          vname + "=arr" + sid + "[" + indv + "+=1];o+='";
      })
      .replace(config.evaluate || skip, function (m, code) {
        return "';" + unescape(code) + "o+='";
      }) +
      "';return o;")
    .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
    .replace(/(\s|;|\}|^|\{)o\+='';/g, '$1').replace(/\+''/g, "");
  //.replace(/(\s|;|\}|^|\{)o\+=''\+/g,'$1o+=');

  if (needhtmlencode) {
    if (!config.selfcontained && window && !window._$eh) window._$eh = encodeHTMLSource(config.doNotSkipEncoded);
    str = "var eh = typeof _$eh !== 'undefined' ? _$eh : (" +
      encodeHTMLSource.toString() + "(" + (config.doNotSkipEncoded || '') + "));" +
      str;
  }
  try {
    return new Function(config.varname, str);
  } catch (e) {
    /* istanbul ignore else */
    if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
    throw e;
  }
};

export function compile(tmpl, def) {
  return template(tmpl, null, def);
};

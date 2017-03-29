/**
 * inspire from http://rossscrivener.co.uk/blog/javascript-get-domain-exclude-subdomain
 */

/**
 * the tool is based on you can't set at a cookie on parent domain
 * like under `www.test.example.com`, you can't set a cookie on `example.com`,
 * but you can set a cookie on `test.example.com` and its sub-domains.
 * @returns {string}
 */
export function extractMainDomain() {
  let index = 0;
  let domain = location.hostname;
  const domainSegments = domain.split('.');
  const cookieId = '_gd' + (new Date()).getTime();
  while (index < (domainSegments.length - 1) && document.cookie.indexOf(`${cookieId}=${cookieId}`) === -1) {
    index++;
    domain = domainSegments.slice(-1 - index).join('.');
    document.cookie = `${cookieId}=${cookieId};domain=${domain};`;
  }
  document.cookie = `${cookieId}=;expires=${new Date(0)};domain=${domain};`;
  return domain;
}

/**
 * remove the tail nation-like tld(top-level domain), like `www.google.com.hk`,
 * will return `google.com`
 * @returns {string}
 */
export function extractCoreDomain() {
  const domain = extractMainDomain();
  const domainSegments = domain.split('.');
  if (domainSegments.length > 2) {
    domainSegments.pop();
    return domainSegments.join('.');
  }

  return domain
}

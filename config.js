/* Site settings. The website is served by the Spring Boot app itself, so API_BASE is empty
   (same origin). If you open index.html from another place (Live Server, file://) set the
   backend address here, e.g. 'http://localhost:8080'. */
window.MASHWAR_CONFIG = {
  API_BASE: location.protocol === 'file:' ? 'http://localhost:8080' : '',
  DEFAULT_LANG: 'ar',
  BRAND: { ar: 'مشوار', en: 'Mashwar' },
  CURRENCY: { ar: 'ج.م', en: 'EGP' }
};

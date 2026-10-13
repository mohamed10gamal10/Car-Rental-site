(function () {
  'use strict';
  var CFG = window.MASHWAR_CONFIG, L = window.Lang, t = L.t, Art = window.Art, Api = window.Api, Session = window.Session;
  var main = document.getElementById('main');
  var routeId = 0, fleet = null, fleetAt = 0, nextHash = null;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); });
  }
  function isAdmin() { var u = Session.user; return !!u && u.role === 'ADMIN'; }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }

  var STATUS = {
    Avalaible: { k: 'status.ok', cls: 'ok' },
    Rented: { k: 'status.rented', cls: 'busy' },
    Maintence: { k: 'status.maint', cls: 'maint' },
    _: { k: 'status.unknown', cls: 'none' }
  };
  function pill(c) { var s = STATUS[c.carStatues] || STATUS._; return '<span class="pill ' + s.cls + '">' + esc(t(s.k)) + '</span>'; }
  function carName(c) { return ((c.prand || '') + ' ' + (c.model || '')).trim(); }
  function plate(c, big) {
    var p = String(c.platenumber || '').trim();
    return '<span class="plate' + (big ? ' plate-lg' : '') + '" dir="auto">' + esc(p || '-') + '</span>';
  }
  function toast(msg) {
    var box = $('#toasts'), el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg; box.appendChild(el);
    setTimeout(function () { el.remove(); }, 3800);
  }
  function errMsg(e) {
    if (!(e instanceof Api.ApiError)) return t('err.generic');
    if (e.status === 0) return t('err.network', { base: CFG.API_BASE || location.origin });
    if (e.status === 401) return t('err.session');
    if (e.status === 403) return Session.token ? t('err.forbidden') : t('err.login');
    if (e.status === 404) return t('err.notFound');
    if (L.lang === 'ar' && e.message) return e.message;
    return t('err.generic');
  }
  function loadingBlock() { return '<div class="state" aria-busy="true"><p>' + esc(t('loading')) + '</p></div>'; }
  function errorState(e) {
    var needLogin = e instanceof Api.ApiError && (e.status === 401 || e.status === 403) && !Session.token;
    return '<div class="wrap"><div class="state" role="alert"><p>' + esc(errMsg(e)) + '</p>' +
      (needLogin ? '<a class="btn btn-dark" href="#/login">' + esc(t('nav.login')) + '</a>' : '<button class="btn btn-dark" type="button" id="retry">' + esc(t('retry')) + '</button>') +
      '</div></div>';
  }
  function bindRetry() { var b = $('#retry'); if (b) b.addEventListener('click', route); }

  function getCars(force) {
    if (!force && fleet && Date.now() - fleetAt < 30000) return Promise.resolve(fleet);
    return Api.cars().then(function (list) { fleet = list; fleetAt = Date.now(); return list; });
  }
  function isFree(c) { return c.carStatues === 'Avalaible'; }

  function row(c) {
    return '<a class="row" href="#/cars/' + encodeURIComponent(c.id) + '">' +
      '<span class="row-art">' + Art.car(c) + '</span>' +
      '<span class="row-main"><strong>' + esc(carName(c)) + '</strong><small>' + esc(L.num(c.year).replace(/[,٬]/g, '')) + '</small></span>' +
      plate(c) +
      '<span class="row-price"><b>' + esc(L.num(c.priceinday)) + '</b> ' + esc(t('cur')) + ' <small>' + esc(t('per.day')) + '</small></span>' +
      pill(c) + '</a>';
  }

  /* ---------- header / footer ---------- */
  function currentName() { return parse().name; }
  function renderHeader() {
    var u = Session.user, cur = currentName(), other = L.lang === 'ar' ? 'en' : 'ar';
    function a(href, name, label) { return '<a href="' + href + '"' + (cur === name ? ' aria-current="page"' : '') + '>' + esc(label) + '</a>'; }
    $('#top').innerHTML = '<div class="wrap top-in">' +
      '<a class="brand" href="#/"><span class="brand-mark" aria-hidden="true">' + (L.lang === 'ar' ? 'م' : 'M') + '</span><span class="brand-name">' + esc(t('brand')) + '</span></a>' +
      '<nav class="nav" aria-label="' + esc(t('nav.label')) + '">' + a('#/', 'home', t('nav.home')) + a('#/cars', 'cars', t('nav.cars')) +
      (isAdmin() ? a('#/admin', 'admin', t('nav.admin')) : '') + '</nav>' +
      '<div class="top-actions"><button class="btn btn-quiet" type="button" id="lang-btn" lang="' + other + '">' + (other === 'en' ? 'English' : 'عربي') + '</button>' +
      (u ? '<a class="btn btn-quiet" href="#/account"' + (cur === 'account' ? ' aria-current="page"' : '') + '>' + esc(String(u.fullName || u.email).split(' ')[0]) + '</a>'
         : '<a class="btn btn-quiet" href="#/login">' + esc(t('nav.login')) + '</a><a class="btn btn-primary" href="#/register">' + esc(t('nav.register')) + '</a>') +
      '</div></div>';
    $('#lang-btn').addEventListener('click', function () { L.set(other); route(); });
  }
  function renderFooter() {
    $('#foot').innerHTML = '<div class="wrap foot-in"><span>' + esc(t('brand')) + '</span><span>' + esc(t('foot.rights')) + ' ' + new Date().getFullYear() + '</span></div>';
  }

  /* ---------- forms ---------- */
  function field(o) {
    return '<div class="field"><label for="' + o.id + '">' + esc(o.label) + '</label>' +
      '<input id="' + o.id + '" name="' + o.id + '" type="' + (o.type || 'text') + '" autocomplete="' + (o.ac || 'off') + '"' +
      (o.min != null ? ' min="' + o.min + '"' : '') + (o.max != null ? ' max="' + o.max + '"' : '') + (o.mode ? ' inputmode="' + o.mode + '"' : '') +
      ' aria-describedby="' + o.id + '-err"><p class="err" id="' + o.id + '-err"></p></div>';
  }
  function setErrors(form, map) {
    $$('.err', form).forEach(function (p) { p.textContent = ''; });
    $$('input,select', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
    var first = null;
    Object.keys(map || {}).forEach(function (k) {
      var p = $('#' + k + '-err', form), i = $('#' + k, form);
      if (p) p.textContent = map[k];
      if (i) { i.setAttribute('aria-invalid', 'true'); if (!first) first = i; }
    });
    if (first) first.focus();
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- pages ---------- */
  function pageHome(r, my) {
    main.innerHTML = '<div class="wrap"><section class="sign hero" aria-labelledby="h1">' +
      '<div class="hero-copy"><h1 id="h1">' + esc(t('hero.title')) + '</h1><p class="hero-sub">' + esc(t('hero.sub')) + '</p>' +
      '<div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/cars">' + esc(t('hero.cta')) + '</a>' +
      (Session.user ? '' : '<a class="btn btn-onsign btn-lg" href="#/register">' + esc(t('nav.register')) + '</a>') + '</div>' +
      '<p class="hero-stats" id="hero-stats" aria-live="polite"></p></div>' +
      '<div class="road" id="road"><div class="lane"></div></div></section>' +
      '<section class="block" aria-labelledby="h-av"><div class="block-head"><h2 id="h-av">' + esc(t('home.avail')) + '</h2>' +
      '<a class="link" href="#/cars">' + esc(t('home.all')) + '</a></div><div class="board" id="board" aria-busy="true"></div></section></div>';
    return getCars().then(function (cars) {
      if (my !== routeId) return;
      var free = cars.filter(isFree).sort(function (a, b) { return a.priceinday - b.priceinday; });
      var road = $('#road');
      road.insertAdjacentHTML('afterbegin', '<div class="road-car drive">' + Art.car(free[0] || cars[0] || null, { cls: 'hero-car' }) + '</div>');
      var stats = $('#hero-stats');
      stats.textContent = free.length
        ? t('hero.stats', { avail: L.num(free.length), total: L.num(cars.length), price: L.money(free[0].priceinday) })
        : t('hero.none');
      var board = $('#board'); board.removeAttribute('aria-busy');
      board.innerHTML = free.length ? free.slice(0, 5).map(row).join('') : '<p class="empty">' + esc(cars.length ? t('hero.none') : t('empty.none')) + '</p>';
    });
  }

  function pageCars(r, my) {
    var st = 'all', q = '', sort = 'price';
    var chips = [['all', t('f.all')], ['Avalaible', t('status.ok')], ['Rented', t('status.rented')], ['Maintence', t('status.maint')]];
    main.innerHTML = '<div class="wrap"><header class="page-head"><h1>' + esc(t('cars.title')) + '</h1><p class="muted" id="count" aria-live="polite"></p></header>' +
      '<div class="controls"><label class="search"><span class="sr">' + esc(t('cars.search')) + '</span><input id="q" type="search" autocomplete="off" placeholder="' + esc(t('cars.search')) + '"></label>' +
      '<div class="chips" role="group" aria-label="' + esc(t('cars.filter')) + '">' +
      chips.map(function (c) { return '<button type="button" class="chip" data-st="' + c[0] + '" aria-pressed="' + (c[0] === 'all') + '">' + esc(c[1]) + '</button>'; }).join('') + '</div>' +
      '<label class="sort"><span class="sr">' + esc(t('cars.sort')) + '</span><select id="sort"><option value="price">' + esc(t('sort.price')) + '</option><option value="priceDesc">' + esc(t('sort.priceDesc')) + '</option><option value="year">' + esc(t('sort.year')) + '</option></select></label></div>' +
      '<div class="board" id="board" aria-busy="true"></div></div>';
    return getCars(true).then(function (cars) {
      if (my !== routeId) return;
      var board = $('#board'); board.removeAttribute('aria-busy');
      function draw() {
        var qq = norm(q.trim());
        var list = cars.filter(function (c) {
          if (st !== 'all' && c.carStatues !== st) return false;
          return !qq || norm([c.prand, c.model, c.platenumber, c.year].join(' ')).indexOf(qq) !== -1;
        });
        list.sort(function (a, b) {
          return sort === 'price' ? a.priceinday - b.priceinday : sort === 'priceDesc' ? b.priceinday - a.priceinday : b.year - a.year;
        });
        $('#count').textContent = t('cars.count', { n: L.num(list.length) });
        board.innerHTML = list.length ? list.map(row).join('') : '<p class="empty">' + esc(cars.length ? t('empty.filter') : t('empty.none')) + '</p>';
      }
      $('#q').addEventListener('input', function (e) { q = e.target.value; draw(); });
      $('#sort').addEventListener('change', function (e) { sort = e.target.value; draw(); });
      $$('.chip').forEach(function (b) {
        b.addEventListener('click', function () {
          st = b.getAttribute('data-st');
          $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          draw();
        });
      });
      draw();
    });
  }

  function odometer(el, value) {
    var digits = [], i;
    for (i = 0; i < 10; i++) digits.push(L.num(i));
    var s = L.num(value), chars = s.split('');
    var sig = chars.map(function (c) { return digits.indexOf(c) === -1 ? 's' : 'd'; }).join('');
    if (el.getAttribute('data-sig') !== sig) {
      el.setAttribute('data-sig', sig);
      el.innerHTML = chars.map(function (c) {
        if (digits.indexOf(c) === -1) return '<span class="sep">' + esc(c) + '</span>';
        return '<span class="d"><span class="col">' + digits.map(function (g) { return '<i>' + g + '</i>'; }).join('') + '</span></span>';
      }).join('');
    }
    var cols = $$('.col', el), k = 0;
    chars.forEach(function (c) {
      var idx = digits.indexOf(c);
      if (idx !== -1) { cols[k].style.setProperty('--n', idx); k++; }
    });
  }

  function pageCar(r, my) {
    main.innerHTML = loadingBlock();
    return Api.car(r.id).then(function (c) {
      if (my !== routeId) return;
      var days = 3, free = isFree(c);
      main.innerHTML = '<div class="wrap"><a class="link back" href="#/cars">' + esc(t('car.back')) + '</a>' +
        '<article class="detail"><div class="detail-art">' + Art.car(c, { cls: 'detail-car' }) + '<div class="detail-plate">' + plate(c, true) + '</div></div>' +
        '<div class="detail-info"><header><h1>' + esc(carName(c)) + '</h1>' + pill(c) + '</header>' +
        '<dl class="specs">' +
        '<div><dt>' + esc(t('car.brand')) + '</dt><dd>' + esc(c.prand) + '</dd></div>' +
        '<div><dt>' + esc(t('car.model')) + '</dt><dd>' + esc(c.model) + '</dd></div>' +
        '<div><dt>' + esc(t('car.year')) + '</dt><dd>' + esc(String(c.year)) + '</dd></div>' +
        '<div><dt>' + esc(t('per.day')) + '</dt><dd>' + esc(L.money(c.priceinday)) + '</dd></div>' +
        '<div><dt>' + esc(t('per.hour')) + '</dt><dd>' + esc(L.money(c.priceinhour)) + '</dd></div></dl>' +
        '<section class="est" aria-labelledby="est-h"><h2 id="est-h">' + esc(t('est.title')) + '</h2>' +
        '<div class="est-row"><span id="days-l">' + esc(t('est.days')) + '</span>' +
        '<div class="stepper" role="group" aria-labelledby="days-l"><button type="button" id="dm" aria-label="' + esc(t('est.minus')) + '">&minus;</button>' +
        '<output id="dv" aria-live="polite"></output><button type="button" id="dp" aria-label="' + esc(t('est.plus')) + '">+</button></div></div>' +
        '<div class="est-total"><span>' + esc(t('est.total')) + '</span><span class="odo" id="odo"></span><span class="odo-cur">' + esc(t('cur')) + '</span></div>' +
        '<p class="muted small">' + esc(free ? t('est.note') : t('est.busy')) + '</p></section></div></article></div>';
      function upd() {
        $('#dv').textContent = L.num(days);
        odometer($('#odo'), c.priceinday * days);
        $('#dm').disabled = days <= 1; $('#dp').disabled = days >= 60;
      }
      $('#dm').addEventListener('click', function () { if (days > 1) { days--; upd(); } });
      $('#dp').addEventListener('click', function () { if (days < 60) { days++; upd(); } });
      upd();
      document.title = carName(c) + ' | ' + t('brand');
    });
  }

  function authLayout(title, form, alt) {
    return '<div class="wrap"><div class="auth"><aside class="sign auth-side"><span class="brand-mark big" aria-hidden="true">' + (L.lang === 'ar' ? 'م' : 'M') + '</span>' +
      '<p>' + esc(t('login.side')) + '</p><div class="lane static"></div></aside>' +
      '<section class="auth-card"><h1>' + esc(title) + '</h1>' + form + '<p class="alt">' + alt + '</p></section></div></div>';
  }
  function afterAuth(r) {
    toast(t('toast.welcome', { name: String(r.fullName).split(' ')[0] }));
    var h = nextHash || '#/cars'; nextHash = null; go(h);
  }

  function pageLogin() {
    if (Session.token) return go('#/account');
    main.innerHTML = authLayout(t('login.title'),
      '<form id="f" novalidate>' + field({ id: 'email', label: t('f.email'), type: 'email', ac: 'username' }) +
      field({ id: 'password', label: t('f.password'), type: 'password', ac: 'current-password' }) +
      '<p class="err form-err" id="form-err" role="alert"></p><button class="btn btn-dark btn-block" type="submit">' + esc(t('login.submit')) + '</button></form>',
      esc(t('login.alt')) + ' <a class="link" href="#/register">' + esc(t('login.altLink')) + '</a>');
    var f = $('#f');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.email.value.trim(), pw = f.password.value, errs = {};
      if (!EMAIL.test(email)) errs.email = t('v.email');
      if (!pw) errs.password = t('v.required');
      setErrors(f, errs); $('#form-err').textContent = '';
      if (Object.keys(errs).length) return;
      var btn = $('button', f); btn.disabled = true;
      Api.login(email, pw).then(afterAuth, function (er) {
        $('#form-err').textContent = er.status === 401 ? t('err.badCreds') : errMsg(er);
        btn.disabled = false;
      });
    });
  }

  function pageRegister() {
    if (Session.token) return go('#/account');
    main.innerHTML = authLayout(t('reg.title'),
      '<form id="f" novalidate>' + field({ id: 'fullName', label: t('f.name'), ac: 'name' }) +
      field({ id: 'email', label: t('f.email'), type: 'email', ac: 'username' }) +
      field({ id: 'password', label: t('f.password'), type: 'password', ac: 'new-password' }) +
      '<p class="err form-err" id="form-err" role="alert"></p><button class="btn btn-dark btn-block" type="submit">' + esc(t('reg.submit')) + '</button></form>',
      esc(t('reg.alt')) + ' <a class="link" href="#/login">' + esc(t('reg.altLink')) + '</a>');
    var f = $('#f');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = f.fullName.value.trim(), email = f.email.value.trim(), pw = f.password.value, errs = {};
      if (name.length < 3 || name.length > 100) errs.fullName = t('v.name');
      if (!EMAIL.test(email)) errs.email = t('v.email');
      if (pw.length < 6) errs.password = t('v.password');
      setErrors(f, errs); $('#form-err').textContent = '';
      if (Object.keys(errs).length) return;
      var btn = $('button', f); btn.disabled = true;
      Api.register(name, email, pw).then(afterAuth, function (er) {
        if (er.status === 409) setErrors(f, { email: t('err.emailTaken') });
        else if (er.status === 400 && er.fields && Object.keys(er.fields).length) setErrors(f, er.fields);
        else $('#form-err').textContent = errMsg(er);
        btn.disabled = false;
      });
    });
  }

  function needLogin() { nextHash = location.hash; go('#/login'); }

  function pageAccount(r, my) {
    if (!Session.token) return needLogin();
    main.innerHTML = loadingBlock();
    return Api.me().then(function (me) {
      if (my !== routeId) return;
      Session.save({ token: Session.token, user: { id: me.id, fullName: me.fullName, email: me.email, role: me.role } });
      renderHeader();
      main.innerHTML = '<div class="wrap narrow"><header class="page-head"><h1>' + esc(t('acc.title')) + '</h1></header>' +
        '<dl class="specs big"><div><dt>' + esc(t('acc.name')) + '</dt><dd>' + esc(me.fullName) + '</dd></div>' +
        '<div><dt>' + esc(t('acc.email')) + '</dt><dd dir="ltr" class="ltr-text">' + esc(me.email) + '</dd></div>' +
        '<div><dt>' + esc(t('acc.role')) + '</dt><dd>' + esc(t('role.' + me.role)) + '</dd></div></dl>' +
        '<div class="actions">' + (me.role === 'ADMIN' ? '<a class="btn btn-primary" href="#/admin">' + esc(t('acc.admin')) + '</a>' : '') +
        '<button class="btn btn-dark" type="button" id="out">' + esc(t('acc.logout')) + '</button></div></div>';
      $('#out').addEventListener('click', function () {
        Api.logout().then(function () { toast(t('toast.bye')); go('#/'); });
      });
    }, function (e) {
      if (e instanceof Api.ApiError && (e.status === 401 || e.status === 403)) { Session.clear(); return needLogin(); }
      throw e;
    });
  }

  function pageAdmin(r, my) {
    if (!Session.token) return needLogin();
    if (!isAdmin()) { main.innerHTML = '<div class="wrap"><div class="state" role="alert"><p>' + esc(t('adm.only')) + '</p></div></div>'; return; }
    main.innerHTML = '<div class="wrap"><header class="page-head"><h1>' + esc(t('adm.title')) + '</h1><p class="muted" id="hello"></p></header>' +
      '<div class="admin"><section class="panel" aria-labelledby="add-h"><h2 id="add-h">' + esc(t('adm.add')) + '</h2>' +
      '<form id="f" novalidate>' + field({ id: 'prand', label: t('f.brand') }) + field({ id: 'model', label: t('f.model') }) +
      field({ id: 'year', label: t('f.year'), type: 'number', min: 1980, max: new Date().getFullYear() + 1, mode: 'numeric' }) +
      field({ id: 'platenumber', label: t('f.plate') }) +
      field({ id: 'priceinday', label: t('f.price'), type: 'number', min: 1, mode: 'numeric' }) +
      '<div class="field"><label for="carStatues">' + esc(t('f.status')) + '</label><select id="carStatues"><option value="Avalaible">' + esc(t('status.ok')) + '</option><option value="Rented">' + esc(t('status.rented')) + '</option><option value="Maintence">' + esc(t('status.maint')) + '</option></select></div>' +
      '<p class="err form-err" id="form-err" role="alert"></p><button class="btn btn-dark btn-block" type="submit">' + esc(t('adm.save')) + '</button></form></section>' +
      '<section class="panel" aria-labelledby="list-h"><h2 id="list-h">' + esc(t('adm.list')) + '</h2><div class="table-wrap" id="tbl" aria-busy="true"></div></section></div></div>';

    Api.dashboard().then(function (d) { if (my === routeId && d && d.message) $('#hello').textContent = d.message; }, function () {});

    function drawTable(cars) {
      var tb = $('#tbl'); tb.removeAttribute('aria-busy');
      tb.innerHTML = cars.length ? '<table><thead><tr><th>' + esc(t('f.plate')) + '</th><th>' + esc(t('f.model')) + '</th><th>' + esc(t('f.year')) + '</th><th>' + esc(t('f.price')) + '</th><th>' + esc(t('f.status')) + '</th></tr></thead><tbody>' +
        cars.map(function (c) {
          return '<tr><td>' + plate(c) + '</td><td><a class="link" href="#/cars/' + encodeURIComponent(c.id) + '">' + esc(carName(c)) + '</a></td><td>' + esc(String(c.year)) + '</td><td>' + esc(L.num(c.priceinday)) + '</td><td>' + pill(c) + '</td></tr>';
        }).join('') + '</tbody></table>' : '<p class="empty">' + esc(t('empty.none')) + '</p>';
    }
    var cars = [];
    function refresh() {
      return getCars(true).then(function (l) { if (my !== routeId) return; cars = l; drawTable(l); }, function (e) { if (my === routeId) $('#tbl').innerHTML = '<p class="empty">' + esc(errMsg(e)) + '</p>'; });
    }
    refresh();

    var f = $('#f');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = { prand: f.prand.value.trim(), model: f.model.value.trim(), platenumber: f.platenumber.value.trim(), year: parseInt(f.year.value, 10), price: parseInt(f.priceinday.value, 10) }, errs = {};
      if (!v.prand) errs.prand = t('v.required');
      if (!v.model) errs.model = t('v.required');
      if (!v.platenumber) errs.platenumber = t('v.required');
      else if (cars.some(function (c) { return norm(c.platenumber).replace(/\s+/g, '') === norm(v.platenumber).replace(/\s+/g, ''); })) errs.platenumber = t('adm.dup');
      if (!(v.year >= 1980 && v.year <= new Date().getFullYear() + 1)) errs.year = t('v.year');
      if (!(v.price > 0)) errs.priceinday = t('v.price');
      setErrors(f, errs); $('#form-err').textContent = '';
      if (Object.keys(errs).length) return;
      var btn = $('button', f); btn.disabled = true;
      Api.addCar({ prand: v.prand, model: v.model, year: v.year, platenumber: v.platenumber, priceinday: v.price, carStatues: f.carStatues.value }).then(function () {
        toast(t('adm.added')); f.reset(); btn.disabled = false; refresh();
      }, function (er) { $('#form-err').textContent = errMsg(er); btn.disabled = false; });
    });
  }

  /* ---------- router ---------- */
  function parse() {
    var parts = (location.hash || '#/').replace(/^#/, '').split('/').filter(Boolean);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'cars') return parts[1] ? { name: 'car', id: decodeURIComponent(parts[1]) } : { name: 'cars' };
    if (['login', 'register', 'account', 'admin'].indexOf(parts[0]) !== -1) return { name: parts[0] };
    return { name: 'home' };
  }
  var PAGES = { home: pageHome, cars: pageCars, car: pageCar, login: pageLogin, register: pageRegister, account: pageAccount, admin: pageAdmin };
  var TITLES = { home: 'nav.home', cars: 'nav.cars', car: 'nav.cars', login: 'login.title', register: 'reg.title', account: 'acc.title', admin: 'adm.title' };

  function route() {
    var r = parse(), my = ++routeId;
    document.title = t(TITLES[r.name]) + ' | ' + t('brand');
    renderHeader(); renderFooter();
    main.innerHTML = loadingBlock();
    var p;
    try { p = PAGES[r.name](r, my); } catch (e) { p = Promise.reject(e); }
    Promise.resolve(p).then(null, function (e) {
      if (my !== routeId) return;
      main.innerHTML = errorState(e); bindRetry();
    }).then(function () {
      if (my === routeId) { window.scrollTo(0, 0); }
    });
  }

  window.addEventListener('hashchange', function () { route(); main.focus({ preventScroll: true }); });
  window.addEventListener('mashwar:session', function () { toast(t('toast.session')); renderHeader(); });
  L.apply();
  route();
})();

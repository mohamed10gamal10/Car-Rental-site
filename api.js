(function () {
  'use strict';
  var CFG = window.MASHWAR_CONFIG;
  var KEY = 'mashwar.session';

  var Session = {
    data: null,
    load: function () { try { this.data = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { this.data = null; } return this.data; },
    save: function (d) { this.data = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    clear: function () { this.data = null; try { localStorage.removeItem(KEY); } catch (e) {} },
    get token() { return this.data && this.data.token; },
    get user() { return this.data && this.data.user; }
  };
  Session.load();

  function ApiError(status, message, fields) {
    this.status = status; this.message = message || ''; this.fields = fields || {};
  }
  ApiError.prototype = Object.create(Error.prototype);

  function request(path, o) {
    o = o || {};
    var headers = { Accept: 'application/json' };
    var hasBody = o.body !== undefined;
    if (hasBody) headers['Content-Type'] = 'application/json';
    var useAuth = o.auth !== false && Session.token;
    if (useAuth) headers.Authorization = 'Bearer ' + Session.token;
    return fetch(CFG.API_BASE + path, {
      method: o.method || 'GET', headers: headers, body: hasBody ? JSON.stringify(o.body) : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        if (text) { try { data = JSON.parse(text); } catch (e) { data = text; } }
        if (!res.ok) {
          var obj = data && typeof data === 'object' ? data : {};
          if (res.status === 401 && useAuth) {
            Session.clear();
            window.dispatchEvent(new Event('mashwar:session'));
          }
          throw new ApiError(res.status, obj.message || obj.masage || '', obj.errors);
        }
        return data;
      });
    }, function () { throw new ApiError(0, ''); });
  }

  function saveAuth(r) {
    Session.save({ token: r.token, user: { id: r.userId, fullName: r.fullName, email: r.email, role: r.role } });
    return r;
  }

  window.Api = {
    ApiError: ApiError,
    login: function (email, password) { return request('/api/auth/login', { method: 'POST', body: { email: email, password: password }, auth: false }).then(saveAuth); },
    register: function (fullName, email, password) { return request('/api/auth/register', { method: 'POST', body: { fullName: fullName, email: email, password: password }, auth: false }).then(saveAuth); },
    logout: function () { return request('/api/auth/logout', { method: 'POST' }).catch(function () {}).then(function () { Session.clear(); }); },
    me: function () { return request('/api/user/me'); },
    dashboard: function () { return request('/api/admin/dashboard'); },
    cars: function () {
      return request('/api/car/allcar?page=0&size=200', { auth: false }).then(function (d) { return Array.isArray(d) ? d : (d && d.content) || []; });
    },
    car: function (id) { return request('/api/car/id/' + encodeURIComponent(id), { auth: false }); },
    addCar: function (car) { return request('/api/car/admin/addcar', { method: 'POST', body: car }); }
  };
  window.Session = Session;
})();

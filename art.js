/* Side-view car drawings, generated as SVG so the site needs no image files.
   Body colours come from the Tailwind CSS v3 palette. */
(function () {
  'use strict';
  var PALETTE = ['#DC2626', '#2563EB', '#F97316', '#0D9488', '#7C3AED', '#475569', '#0EA5E9', '#E11D48', '#65A30D', '#E4E4E7', '#1E293B'];

  var BODY = {
    sedan: {
      d: 'M16 74 Q12 74 12 68 L12 58 Q12 52 20 50 L56 44 L82 24 Q86 20 94 20 L148 20 Q156 20 162 26 L184 44 L214 50 Q228 52 228 60 L228 68 Q228 74 224 74 L205 74 A15 15 0 0 0 175 74 L65 74 A15 15 0 0 0 35 74 Z',
      w: ['M62 43 L85 27 L116 27 L116 43 Z', 'M122 43 L122 27 L148 27 Q153 27 157 31 L174 43 Z'],
      wheels: [50, 190], base: 74, hl: 12, tl: 221, seam: 119
    },
    suv: {
      d: 'M16 76 Q12 76 12 70 L12 56 Q12 50 20 48 L52 44 L72 22 Q75 18 82 18 L176 18 Q184 18 188 24 L206 44 L222 48 Q230 50 230 58 L230 70 Q230 76 226 76 L207 76 A15 15 0 0 0 177 76 L63 76 A15 15 0 0 0 33 76 Z',
      w: ['M58 42 L76 25 L108 25 L108 42 Z', 'M114 42 L114 25 L146 25 L146 42 Z', 'M152 42 L152 25 L174 25 Q178 25 181 29 L196 42 Z'],
      wheels: [48, 192], base: 76, hl: 12, tl: 223, seam: 111
    },
    hatch: {
      d: 'M16 74 Q12 74 12 68 L12 58 Q12 52 20 50 L54 45 L80 24 Q84 20 92 20 L168 20 Q176 20 180 26 L208 52 Q222 54 224 62 L224 68 Q224 74 220 74 L203 74 A15 15 0 0 0 173 74 L67 74 A15 15 0 0 0 37 74 Z',
      w: ['M60 44 L82 27 L112 27 L112 44 Z', 'M118 44 L118 27 L164 27 Q168 27 171 30 L192 48 L118 48 Z'],
      wheels: [52, 188], base: 74, hl: 12, tl: 217, seam: 115
    }
  };

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function bodyType(c) {
    var n = ((c.prand || '') + ' ' + (c.model || '')).toLowerCase();
    if (/sportage|zs|tucson|suv|cr-?v|rav|qashqai|kicks|tiguan|jeep|pajero|hilux|x[1-7]\b|glc|duster|creta|seltos/.test(n)) return 'suv';
    if (/yaris|picanto|i10|i20|swift|spark|golf|polo|rio|clio|micra|panda|aveo|\bfit\b|hatch/.test(n)) return 'hatch';
    return 'sedan';
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.round(((n >> 16) & 255) * (1 - amt)), g = Math.round(((n >> 8) & 255) * (1 - amt)), b = Math.round((n & 255) * (1 - amt));
    return '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
  }

  function car(c, opts) {
    opts = opts || {};
    c = c || { prand: 'Toyota', model: 'Corolla', platenumber: 'default' };
    var key = String(c.platenumber || '') + String(c.model || '') + String(c.prand || '');
    var color = PALETTE[hash(key) % PALETTE.length];
    var b = BODY[bodyType(c)];
    var dark = shade(color, 0.28);
    var gy = b.base + 13;
    var wheels = b.wheels.map(function (x) {
      return '<circle cx="' + x + '" cy="' + b.base + '" r="13" fill="#1E293B"/><circle cx="' + x + '" cy="' + b.base + '" r="5.5" fill="#CBD5E1"/>';
    }).join('');
    var wins = b.w.map(function (d) { return '<path d="' + d + '" fill="#E0F2FE"/>'; }).join('');
    return '<svg class="car-art ' + (opts.cls || '') + '" viewBox="0 0 240 100" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="120" cy="' + (gy + 2) + '" rx="108" ry="4" fill="#0F172A" opacity=".14"/>' +
      '<path d="' + b.d + '" fill="' + color + '"/>' +
      wins +
      '<path d="M' + b.seam + ' 46 L' + b.seam + ' ' + b.base + '" stroke="' + dark + '" stroke-width="1.6" fill="none"/>' +
      '<rect x="' + b.hl + '" y="55" width="8" height="5" rx="2" fill="#FDE68A"/>' +
      '<rect x="' + b.tl + '" y="56" width="7" height="6" rx="2" fill="#EF4444"/>' +
      wheels + '</svg>';
  }
  window.Art = { car: car };
})();

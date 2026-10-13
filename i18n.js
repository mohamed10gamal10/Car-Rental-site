(function () {
  'use strict';
  var CFG = window.MASHWAR_CONFIG;
  var D = {
    ar: {
      brand: CFG.BRAND.ar, cur: CFG.CURRENCY.ar, skip: 'تخطي إلى المحتوى',
      'nav.label': 'التنقل الرئيسي', 'nav.home': 'الرئيسية', 'nav.cars': 'العربيات', 'nav.admin': 'لوحة الإدارة',
      'nav.login': 'دخول', 'nav.register': 'حساب جديد',
      'hero.title': 'العربية اللي تناسب مشوارك',
      'hero.sub': 'اختار من العربيات المتاحة وشوف سعر اليوم وسعر الساعة قبل ما تقرر.',
      'hero.cta': 'شوف العربيات',
      'hero.stats': '{avail} من {total} عربية متاحة دلوقتي، وأقل سعر {price} في اليوم.',
      'hero.none': 'مفيش عربيات متاحة دلوقتي.',
      'home.avail': 'عربيات متاحة', 'home.all': 'كل العربيات',
      'cars.title': 'العربيات', 'cars.count': '{n} عربية', 'cars.search': 'ابحث بالماركة أو الموديل أو اللوحة',
      'cars.filter': 'فلترة بالحالة', 'cars.sort': 'الترتيب',
      'sort.price': 'الأرخص أولًا', 'sort.priceDesc': 'الأغلى أولًا', 'sort.year': 'الأحدث أولًا',
      'f.all': 'الكل',
      'empty.filter': 'مفيش عربيات بالشكل ده. جرّب تغيّر البحث.',
      'empty.none': 'لسه مفيش عربيات. المدير يقدر يضيف من لوحة الإدارة.',
      'status.ok': 'متاحة', 'status.rented': 'مؤجرة', 'status.maint': 'في الصيانة', 'status.unknown': 'غير محددة',
      'per.day': 'في اليوم', 'per.hour': 'في الساعة',
      'car.back': 'رجوع للعربيات', 'car.brand': 'الماركة', 'car.model': 'الموديل', 'car.year': 'السنة',
      'car.plate': 'اللوحة', 'car.status': 'الحالة',
      'est.title': 'قدّر التكلفة', 'est.days': 'عدد الأيام', 'est.total': 'الإجمالي',
      'est.note': 'تقدير على أساس سعر اليوم.', 'est.busy': 'العربية دي مش متاحة دلوقتي.',
      'est.minus': 'يوم أقل', 'est.plus': 'يوم زيادة',
      'login.title': 'تسجيل الدخول', 'login.submit': 'دخول', 'login.alt': 'معندكش حساب؟', 'login.altLink': 'إنشاء حساب',
      'login.side': 'حساب واحد، وكل العربيات في مكان واحد.',
      'reg.title': 'إنشاء حساب', 'reg.submit': 'إنشاء الحساب', 'reg.alt': 'عندك حساب؟', 'reg.altLink': 'تسجيل الدخول',
      'f.name': 'الاسم الكامل', 'f.email': 'البريد الإلكتروني', 'f.password': 'كلمة المرور',
      'v.name': 'الاسم لازم يكون من 3 لـ 100 حرف', 'v.email': 'اكتب بريد إلكتروني صحيح',
      'v.password': 'كلمة المرور لازم تكون 6 حروف على الأقل', 'v.required': 'الحقل ده مطلوب',
      'v.year': 'اكتب سنة صحيحة', 'v.price': 'اكتب سعر أكبر من صفر',
      'acc.title': 'حسابي', 'acc.name': 'الاسم', 'acc.email': 'البريد', 'acc.role': 'نوع الحساب',
      'role.ADMIN': 'مدير', 'role.USER': 'مستخدم', 'acc.logout': 'تسجيل الخروج', 'acc.admin': 'فتح لوحة الإدارة',
      'adm.title': 'لوحة الإدارة', 'adm.add': 'إضافة عربية', 'adm.save': 'حفظ العربية', 'adm.list': 'العربيات الحالية',
      'adm.added': 'تمت إضافة العربية', 'adm.dup': 'رقم اللوحة ده موجود قبل كده.', 'adm.only': 'الصفحة دي للمدير فقط.',
      'f.brand': 'الماركة', 'f.model': 'الموديل', 'f.year': 'سنة الصنع', 'f.plate': 'رقم اللوحة', 'f.price': 'سعر اليوم',
      'f.status': 'الحالة',
      'toast.welcome': 'أهلًا {name}', 'toast.bye': 'تم تسجيل الخروج', 'toast.session': 'انتهت الجلسة، سجّل دخولك تاني.',
      'err.network': 'مش قادر أوصل للسيرفر ({base}). اتأكد إن الـ backend شغال.',
      'err.session': 'انتهت الجلسة، سجّل دخولك تاني.', 'err.forbidden': 'مش مسموح لك بالعملية دي.',
      'err.login': 'سجّل دخولك الأول.', 'err.generic': 'حصلت مشكلة. حاول تاني.',
      'err.badCreds': 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'err.emailTaken': 'البريد ده مسجل قبل كده.',
      'err.notFound': 'العربية دي مش موجودة.',
      loading: 'جاري التحميل', retry: 'حاول تاني', 'foot.rights': 'جميع الحقوق محفوظة'
    },
    en: {
      brand: CFG.BRAND.en, cur: CFG.CURRENCY.en, skip: 'Skip to content',
      'nav.label': 'Main navigation', 'nav.home': 'Home', 'nav.cars': 'Cars', 'nav.admin': 'Admin',
      'nav.login': 'Sign in', 'nav.register': 'Create account',
      'hero.title': 'The right car for your trip',
      'hero.sub': 'Pick from the available cars and see the daily and hourly price before you decide.',
      'hero.cta': 'Browse cars',
      'hero.stats': '{avail} of {total} cars are available now, from {price} a day.',
      'hero.none': 'No cars are available right now.',
      'home.avail': 'Available cars', 'home.all': 'All cars',
      'cars.title': 'Cars', 'cars.count': '{n} cars', 'cars.search': 'Search by brand, model or plate',
      'cars.filter': 'Filter by status', 'cars.sort': 'Sort',
      'sort.price': 'Cheapest first', 'sort.priceDesc': 'Most expensive first', 'sort.year': 'Newest first',
      'f.all': 'All',
      'empty.filter': 'No cars match. Try a different search.',
      'empty.none': 'No cars yet. An admin can add cars from the admin panel.',
      'status.ok': 'Available', 'status.rented': 'Rented', 'status.maint': 'In maintenance', 'status.unknown': 'Not set',
      'per.day': 'per day', 'per.hour': 'per hour',
      'car.back': 'Back to cars', 'car.brand': 'Brand', 'car.model': 'Model', 'car.year': 'Year',
      'car.plate': 'Plate', 'car.status': 'Status',
      'est.title': 'Estimate the cost', 'est.days': 'Number of days', 'est.total': 'Total',
      'est.note': 'Estimate based on the daily price.', 'est.busy': 'This car is not available right now.',
      'est.minus': 'One day less', 'est.plus': 'One day more',
      'login.title': 'Sign in', 'login.submit': 'Sign in', 'login.alt': 'No account yet?', 'login.altLink': 'Create one',
      'login.side': 'One account, every car in one place.',
      'reg.title': 'Create account', 'reg.submit': 'Create account', 'reg.alt': 'Already have an account?', 'reg.altLink': 'Sign in',
      'f.name': 'Full name', 'f.email': 'Email', 'f.password': 'Password',
      'v.name': 'Name must be 3 to 100 characters', 'v.email': 'Enter a valid email address',
      'v.password': 'Password must be at least 6 characters', 'v.required': 'This field is required',
      'v.year': 'Enter a valid year', 'v.price': 'Enter a price above zero',
      'acc.title': 'My account', 'acc.name': 'Name', 'acc.email': 'Email', 'acc.role': 'Account type',
      'role.ADMIN': 'Admin', 'role.USER': 'User', 'acc.logout': 'Sign out', 'acc.admin': 'Open admin panel',
      'adm.title': 'Admin panel', 'adm.add': 'Add a car', 'adm.save': 'Save car', 'adm.list': 'Current cars',
      'adm.added': 'Car added', 'adm.dup': 'This plate number already exists.', 'adm.only': 'This page is for admins only.',
      'f.brand': 'Brand', 'f.model': 'Model', 'f.year': 'Year', 'f.plate': 'Plate number', 'f.price': 'Price per day',
      'f.status': 'Status',
      'toast.welcome': 'Welcome {name}', 'toast.bye': 'Signed out', 'toast.session': 'Your session ended. Please sign in again.',
      'err.network': 'Cannot reach the server ({base}). Make sure the backend is running.',
      'err.session': 'Your session ended. Please sign in again.', 'err.forbidden': 'You are not allowed to do this.',
      'err.login': 'Please sign in first.', 'err.generic': 'Something went wrong. Try again.',
      'err.badCreds': 'Wrong email or password', 'err.emailTaken': 'This email is already registered.',
      'err.notFound': 'This car does not exist.',
      loading: 'Loading', retry: 'Try again', 'foot.rights': 'All rights reserved'
    }
  };

  var Lang = { lang: 'ar' };
  var saved = null;
  try { saved = localStorage.getItem('mashwar.lang'); } catch (e) {}
  Lang.lang = (saved === 'ar' || saved === 'en') ? saved : CFG.DEFAULT_LANG;

  Lang.apply = function () {
    document.documentElement.lang = Lang.lang;
    document.documentElement.dir = Lang.lang === 'ar' ? 'rtl' : 'ltr';
    var s = document.getElementById('skip');
    if (s) s.textContent = Lang.t('skip');
  };
  Lang.set = function (l) {
    Lang.lang = l;
    try { localStorage.setItem('mashwar.lang', l); } catch (e) {}
    Lang.apply();
  };
  Lang.t = function (key, vars) {
    var s = (D[Lang.lang] && D[Lang.lang][key]) || D.ar[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };
  Lang.locale = function () { return Lang.lang === 'ar' ? 'ar-EG' : 'en-US'; };
  Lang.num = function (n) { return new Intl.NumberFormat(Lang.locale()).format(Number(n) || 0); };
  Lang.money = function (n) { return Lang.num(n) + ' ' + Lang.t('cur'); };
  window.Lang = Lang;
})();

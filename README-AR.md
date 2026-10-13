# مشوار - موقع تأجير العربيات (Spring Boot + Frontend)

الفرونت مدمج جوه الـ backend (`src/main/resources/static`)، فتشغيل واحد بيفتح الموقع والـ API مع بعض.

## التشغيل
1. شغّل MySQL (الإعدادات في `src/main/resources/application.properties`، وتتغير بالمتغيرات `DB_URL` و`DB_USERNAME` و`DB_PASSWORD`).
2. `./mvnw spring-boot:run`  (محتاج JDK 26 زي الـ pom)
3. افتح http://localhost:8080

## حسابات وبيانات تجريبية
أول تشغيل بيتعمل أدمن + 10 عربيات (من `DataSeeder`):
- admin@carrental.com / Admin@12345  (غيّرهم بـ `ADMIN_EMAIL` و`ADMIN_PASSWORD`، أو اقفل الـ seed بـ `SEED_ENABLED=false`)

## ربط الفرونت بالـ API
| الصفحة | الـ endpoint |
|---|---|
| تسجيل / دخول / خروج | `POST /api/auth/register` · `/login` · `/logout` |
| قائمة العربيات وتفاصيلها | `GET /api/car/allcar` · `GET /api/car/id/{id}` |
| حسابي | `GET /api/user/me` |
| لوحة الإدارة | `GET /api/admin/dashboard` · `POST /api/car/admin/addcar` |

لو فتحت الفرونت من مكان تاني (Live Server مثلًا) غيّر `API_BASE` في `static/js/config.js`.

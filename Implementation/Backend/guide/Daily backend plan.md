# 🗓️ برنامه روزانه

Made by Hamed using AI 

Management by Sajad

### روز ۱ - احراز هویت + پایه‌سازی☀️

| نفر  | وظیفه                                        |
| ---- | -------------------------------------------- |
| 1    | AuthController (Login, Register, ForgotPass) |
| 2    | AuthService + JWT + Role-based Auth          |
| 3    | AppDbContext + Migration (همه جداول)         |
| 4    | ExceptionHandlingMiddleware                  |
| 5    | DTOهای Auth + Constants (Roles, Status)      |

خروجی: ✅ ثبت‌نام/ورود/فراموشی رمز ✅ Migration اولیه ✅ مدیریت خطاها

---

## روز ۲ - سازمان + سرویس‌ها + تایید☀️

| نفر  | وظیفه                                        |
| ---- | -------------------------------------------- |
| 1    | OrgController (ثبت سازمان)                   |
| 2    | OrgProfileController (پروفایل + ویرایش کامل) |
| 3    | OrgRepository + ServiceRepository            |
| 4    | AdminOrgController (لیست تایید + تایید/رد)   |
| 5    | DTOهای Org + Service                         |

خروجی: ✅ ثبت/پروفایل/ویرایش سازمان ✅ تعریف/ویرایش/حذف سرویس ✅ لیست تایید

---

## روز ۳ - نوبت‌ها + کاربران☀️

| نفر  | وظیفه                                              |
| ---- | -------------------------------------------------- |
| 1    | AppointmentController (ایجاد/لیست/لغو/تغییر وضعیت) |
| 2    | AdminUserController (لیست کاربران)                 |
| 3    | UserController (پروفایل کاربر)                     |
| 4    | AppointmentRepository (فیلترهای پیشرفته)           |
| 5    | DTOهای Appointment + User                          |

خروجی: ✅ ایجاد نوبت (با سرویس/تاریخ/زمان/پرسنل) ✅ لیست نوبت‌ها (با فیلتر) ✅ تغییر وضعیت نوبت ✅ لیست کاربران

---

## روز ۴ - داشبوردها + پرسنل☀️

| نفر‍‍  | وظیفه                                         |
| ---- | --------------------------------------------- |
| 1    | OrgAdmin Dashboard (آمار سازمان + نمودارها)   |
| 2    | Admin Dashboard (آمار کلی + نمودارها)         |
| 3    | Staff Dashboard + StaffService (مدیریت پرسنل) |
| 4    | تکمیل Repository‌ها (متدهای آماری)             |
| 5    | DTOهای Dashboard + Staff                      |

خروجی: ✅ Admin Dashboard ✅ OrgAdmin Dashboard ✅ Staff Dashboard ✅ CRUD پرسنل

---

## روز ۵ - جستجو + یکپارچه‌سازی☀️

| نفر  | وظیفه                                        |
| ---- | -------------------------------------------- |
| 1    | SearchController (جستجوی سازمان‌ها و سرویس‌ها) |
| 2    | تکمیل Exception Handling + Logging           |
| 3    | FluentValidation + AutoMapper                |
| 4    | تست End-to-End + رفع باگ                     |
| 5    | مستندسازی Swagger + Deploy Prep              |

خروجی: ✅ جستجوی پیشرفته ✅ ارورهای استاندارد ✅ اعتبارسنجی کامل ✅ مستندسازی
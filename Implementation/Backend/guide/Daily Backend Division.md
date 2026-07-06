# 🗓️ برنامه روزانه

Made by Hamed and Sajad with help of AI

Management by Sajad

---

### روز ۱ - احراز هویت + پایه‌سازی☀️

 (05/4/14)

Branch: Back/auth

| Index | Task                                                         | Responsible      | Status      |
| :---: | ------------------------------------------------------------ | ---------------- | ----------- |
|   1   | AuthController (Login, Register, ForgotPass)                 | Hamed            | Done        |
|   2   | AuthService + JWT + Role-based Auth                          | Sajad            | In progress |
|   3   | نوشتن تمام Entities (User, Organization, Service, Staff, Appointment, Review) + AppDbContext + Migration | Abolfazl         | Done        |
|   4   | ExceptionHandlingMiddleware                                  | Ali              | Done        |
|   5   | DTOهای Auth + Constants (Roles, Status)                      | Mohammad Hossein | Done        |

خروجی: ✅ ثبت‌نام/ورود/فراموشی رمز ✅ Migration اولیه ✅ مدیریت خطاها

---

## روز ۲ - سازمان + سرویس‌ها + تایید☀️

(05/4/15)

| Index | Task                                                         | Responsible      | Status  | Dependency |
| ----- | ------------------------------------------------------------ | ---------------- | ------- | ---------- |
| 1     | OrgController (ثبت سازمان)                                   | Hamed            | After 3 | 3          |
| 2     | OrgProfileController (پروفایل از دید مدیر کسب و کار + ویرایش کامل) | Ali              | After 3 | 3          |
| 3     | OrgRepository + ~~ServiceRepository~~ + UnregisteredORGRepository + UserRepository | Abolfazl         | After 5 | 5          |
| 4     | AdminOrgController (لیست تایید + تایید/رد)                   | Sajad            | After 3 | 3          |
| 5     | DTOهای Org + Service                                         | Mohammad Hossein | Open    |            |

خروجی: ✅ ثبت/پروفایل/ویرایش سازمان ✅ تعریف/ویرایش/حذف سرویس ✅ لیست تایید

---

## روز ۳ - نوبت‌ها + کاربران☀️

 (05/4/16)

| نفر  | وظیفه                                              |
| ---- | -------------------------------------------------- |
| 1    | AppointmentController (ایجاد/لیست/لغو/تغییر وضعیت) |
| 2    | AdminUserController (لیست کاربران)                 |
| 3    | UserController (پروفایل کاربر)                     |
| 4    | AppointmentRepository (فیلترهای پیشرفته)           |
| 5    | DTOهای Appointment + User                          |
| 6    | PublicORGProfileController                         |

خروجی: ✅ ایجاد نوبت (با سرویس/تاریخ/زمان/پرسنل) ✅ لیست نوبت‌ها (با فیلتر) ✅ تغییر وضعیت نوبت ✅ لیست کاربران

---

## روز ۴ - داشبوردها + پرسنل☀️

 (05/4/17)

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

 (05/4/18)

| نفر  | وظیفه                                        |
| ---- | -------------------------------------------- |
| 1    | SearchController (جستجوی سازمان‌ها و سرویس‌ها) |
| 2    | تکمیل Exception Handling + Logging           |
| 3    | FluentValidation + AutoMapper                |
| 4    | تست End-to-End + رفع باگ                     |
| 5    | مستندسازی Swagger + Deploy Prep              |
|      |                                              |

خروجی: ✅ جستجوی پیشرفته ✅ ارورهای استاندارد ✅ اعتبارسنجی کامل ✅ مستندسازی

---

## Checklist

این صفحات باید کار کنند

- [ ] login / register / forrgot pass
- [ ] approval list / suspend list
- [ ] همه داشبوردا
- [ ] user list
- [ ] نمایش ارور ها
- [ ] staff list
- [ ] appointment list
- [ ] user profile
- [ ] org profile
- [ ] org profile edit
- [ ] org register
- [ ] search

---

## Backend structure

> ```
> .
> ├── Constants
> │   ├── AppointmentStatus.cs
> │   └── Roles.cs
> ├── Controllers
> │   ├── Admin
> │   │   ├── AdminAdController.cs
> │   │   ├── AdminDashboardController.cs
> │   │   ├── AdminOrgController.cs
> │   │   └── AdminUserController.cs
> │   ├── Auth
> │   │   └── AuthController.cs
> │   ├── Org
> │   │   ├── OrgAdminController.cs
> │   │   ├── OrgController.cs
> │   │   ├── OrgProfileController.cs
> │   │   ├── OrgStaffController.cs
> │   │   └── OrgSupportController.cs
> │   ├── ReviewController.cs
> │   ├── SearchController.cs
> │   └── User
> │       └── UserController.cs
> ├── Data
> │   └── Migrations
> │       └── AppContext.cs
> ├── Extensions
> │   └── ServiceCollectionExtensions.cs
> ├── Middlewares
> │   └── ExceptionHandlingMiddleware.cs
> ├── Models
> │   ├── DTOs
> │   │   ├── Admin
> │   │   │   ├── AdManage
> │   │   │   │   ├── AdCreateRequest.cs
> │   │   │   │   └── AdDto.cs
> │   │   │   ├── OrgManage
> │   │   │   │   ├── OrgApprovalDto.cs
> │   │   │   │   └── OrgSuspendDto.cs
> │   │   │   └── UserManage
> │   │   │       ├── UserDetailDto.cs
> │   │   │       └── UsetListDto.cs
> │   │   ├── Auth
> │   │   │   ├── ForgotPasswordRequest.cs
> │   │   │   ├── LoginRequest.cs
> │   │   │   ├── SignUpRequest.cs
> │   │   │   └── TokenResponse.cs
> │   │   ├── Org
> │   │   │   ├── Admin
> │   │   │   │   └── OrgAdminDashboardDto.cs
> │   │   │   ├── Appointment
> │   │   │   │   ├── AppointmentDto.cs
> │   │   │   │   └── AppointmentListResponseDto.cs
> │   │   │   ├── OrgRegisterRequest.cs
> │   │   │   ├── Profile
> │   │   │   │   ├── OrgProfileDto.cs
> │   │   │   │   └── OrgProfileEditRequest.cs
> │   │   │   ├── Staff
> │   │   │   │   ├── StaffDto.cs
> │   │   │   │   └── StaffListResponse.cs
> │   │   │   └── Support
> │   │   │       └── SupportDashboardDto.cs
> │   │   ├── Review
> │   │   │   ├── ReviewDto.cs
> │   │   │   └── SubmitReviewRequest.cs
> │   │   ├── Search
> │   │   │   ├── SearchRequest.cs
> │   │   │   └── SearchResultDto.cs
> │   │   └── User
> │   │       └── UserProfileDto.cs
> │   └── Entities
> │       ├── Advertisement.cs
> │       ├── Appointment.cs
> │       ├── Organization.cs
> │       ├── Review.cs
> │       ├── Staff.cs
> │       └── User.cs
> ├── Program.cs
> ├── Properties
> │   └── launchSettings.json
> ├── Repositories
> │   ├── Implementations
> │   │   ├── AdRepository.cs
> │   │   ├── AppointmentRepository.cs
> │   │   ├── OrgRepository.cs
> │   │   ├── ReviewRepository.cs
> │   │   ├── StaffRepository.cs
> │   │   └── UserRepository.cs
> │   └── Interfaces
> │       ├── IAdRepository.cs
> │       ├── IAppointmentRepository.cs
> │       ├── IOrgRepository.cs
> │       ├── IReviewRepository.cs
> │       ├── IStaffRepository.cs
> │       └── IUserRepository.cs
> ├── ReserveCenter.API.csproj
> ├── ReserveCenter.API.http
> ├── Services
> │   ├── Implementations
> │   │   ├── AdminAdService.cs
> │   │   ├── AdminOrgService.cs
> │   │   ├── AdminUserService.cs
> │   │   ├── AppointmentService.cs
> │   │   ├── AuthService.cs
> │   │   ├── OrgService.cs
> │   │   ├── ReviewService.cs
> │   │   ├── SearchService.cs
> │   │   ├── StaffService.cs
> │   │   └── UserService.cs
> │   └── Interfaces
> │       ├── IAdminAdService.cs
> │       ├── IAdminOrgService.cs
> │       ├── IAdminUserService.cs
> │       ├── IAppointmentService.cs
> │       ├── IAuthService.cs
> │       ├── IOrgService.cs
> │       ├── IReviewService.cs
> │       ├── ISearchService.cs
> │       ├── IStaffService.cs
> │       └── IUserService.cs
> ├── appsettings.Development.json
> └── appsettings.json
> 
> 35 directories, 86 files
> ```
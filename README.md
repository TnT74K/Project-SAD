# ReserveCenter | رزروسنتر

> An online appointment-booking and service-business management platform.<br>
> سامانه‌ای برای رزرو آنلاین نوبت و مدیریت کسب‌وکارهای خدماتی.

<!-- ✍️ Replace both placeholder URLs after creating the public UptimeRobot monitor. -->
[![Website availability — ✍️ Add UptimeRobot badge URL](https://img.shields.io/badge/Website%20availability-Configure%20UptimeRobot-lightgrey)](✍️-paste-the-public-uptimerobot-status-page-url-here)

**Live site:** [rsvcenter.ir](https://rsvcenter.ir/)  
**Second Address:** [here](https://reservecenter.csharpers.workers.dev/)  
**Cloudflare deployment:** ✍️ Add the public deployment URL or environment details.

## Overview | معرفی

ReserveCenter helps customers find service businesses and book appointments, while giving business teams and platform administrators the tools to manage their operations.<br>
رزروسنتر به مشتریان کمک می‌کند کسب‌وکارهای خدماتی را پیدا کنند و نوبت بگیرند؛ همچنین ابزارهای لازم برای مدیریت کسب‌وکار و مدیریت سامانه را فراهم می‌کند.

## Highlights | قابلیت‌های کلیدی

- **Authentication & roles:** registration, login, password recovery, and role selection.<br>
  **احراز هویت و نقش‌ها:** ثبت‌نام، ورود، بازیابی رمز عبور و انتخاب نقش.
- **Business management:** organisation registration, profiles, services, staff, and appointment workflows.<br>
  **مدیریت کسب‌وکار:** ثبت سازمان، پروفایل، خدمات، کارکنان و فرایند نوبت‌ها.
- **Customer experience:** business discovery, search, public profiles, booking, appointment tracking, and reviews.<br>
  **تجربه مشتری:** جست‌وجو، پروفایل عمومی، رزرو، پیگیری نوبت و ثبت نظر.
- **Dashboards & administration:** organisation dashboards plus user, advertisement, and organisation administration.<br>
  **داشبورد و مدیریت:** داشبوردهای سازمانی و مدیریت کاربران، تبلیغات و کسب‌وکارها.

## Project Completion Note | یادداشت تکمیل پروژه

This repository contains the completed implementation and supporting deliverables for an academic course project. It is a project handoff, not a claim of production readiness.<br>
این مخزن شامل پیاده‌سازی تکمیل‌شده و خروجی‌های پشتیبان یک پروژه درسی است و ادعای آماده‌بودن برای محیط عملیاتی ندارد.

- **Team members (5):** ✍️ Add the final names and roles.
- **Course / institution:** ✍️ Add course and institution name.
- **Instructor:** ✍️ Add instructor name.
- **Submission date / version:** ✍️ Add the final delivery date and version.
- **Full documentation:** [Documentation](Documentation/) | **Design assets:** [Design](Design/)

## Availability Monitoring | پایش دسترس‌پذیری

The public site is hosted through Cloudflare. To show live availability and uptime history, create a public HTTPS monitor for `https://rsvcenter.ir/` in UptimeRobot, then replace the badge link above with the monitor's public badge image URL and status-page URL. Keep monitor credentials and API keys outside this repository.<br>
وب‌سایت عمومی از طریق Cloudflare میزبانی می‌شود. برای نمایش وضعیت زنده و سابقه دسترس‌پذیری، یک مانیتور HTTPS عمومی برای `https://rsvcenter.ir/` در UptimeRobot بسازید و آدرس تصویر نشان و صفحه وضعیت عمومی را جایگزین کنید. کلیدهای API و اطلاعات محرمانه را در مخزن قرار ندهید.

## Code Statistics | آمار کد
Last update: 28 Tir 1405

| Language | Files | Lines |
| --- | ---: | ---: |
| HTML | 33 | 5,356 |
| CSS | 26 | 13,659 |
| JavaScript | 22 | 6,890 |
| C# | 139 | 7,886 |

Counts cover source files under `Implementation/` and exclude generated/build output such as `bin/`, `obj/`, and dependencies.<br>
این آمار فقط فایل‌های منبع در `Implementation/` را شامل می‌شود و خروجی‌های تولیدشده مانند `bin/`، `obj/` و وابستگی‌ها را در نظر نمی‌گیرد.

## Repository Structure | ساختار مخزن

```text
.
├── Implementation/          Application source and delivery assets
│   ├── Frontend/            Static HTML, CSS, JavaScript, shared components, and assets
│   ├── Backend/             .NET 9 Web API, controllers, services, repositories, and DTOs
│   └── Database/            Database backup used by the project
├── Documentation/           Complete analysis, requirements, planning, and team deliverables
├── Design/                  Database schema and website design diagrams
├── Knowledge/               Team reference material and technical notes
└── README.md                This project overview and completion note
```

- `Implementation/Frontend/` is the Cloudflare-hosted user interface.
- `Implementation/Backend/ReserveCenter.API/` is the C# API; it follows controller, service, repository, model/DTO, and database-model layers.
- `Documentation/` is the source of truth for the detailed project documentation; this README intentionally stays brief.
- `Design/DatabaseSchema_Final.svg` provides the final database-schema visual.

## Detailed Documentation | مستندات کامل

For requirements, analysis, plans, meeting notes, and project artefacts, start in [Documentation/](Documentation/). Backend-specific development guidance is available in [Implementation/Backend/guide/](Implementation/Backend/guide/), and frontend planning notes are in [Implementation/Frontend/guide/](Implementation/Frontend/guide/).

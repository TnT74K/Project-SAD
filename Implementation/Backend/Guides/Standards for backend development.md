# Standards for backend development

By Sajad

مستندات رسمی مایکروسافت:
Documentations: [here](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/apis?view=aspnetcore-8.0&WT.mc_id=dotnet-35129-website)



از هوش مصنوعی کمک گرفتم

در پایین یک سری استاندارد تعریف شده که به هماهنگی تیم برای پیاده‌سازی بک کمک میکنه

---

#### **1. Git Standards**

- One feature per branch.
- Small, focused commits. | یعنی برای هر هدفی که انجام دادید یه کامیت بزنین
  - این کار، برگرداندن اشتباه خاصی در کد نویسی رو راحت تر میکنه
- Write meaningful commit messages.
- No direct commits to main.



#### **2. Class Diagram sync**

- What we write, should follow CD
- New logic classes in backend should be added to CD



#### **3. API Standards**

اینو خودمم خیلی نمیدونم ولی به نظرم کاربردیه

status codes

```
200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error
```

#### **4. Naming Conventions in C#** (Important)

- Classes -> `PascalCase`
- Properties -> `PascalCase`
- Private fields -> `_camelCase`
- Constants -> `PascalCase`
- Interfaces -> PascalCase beginning with `I`: `IPascalCase`
- Methods -> `PascalCase`
- Variables -> use `var` to define if possible. And names should be in `camelCase`

#### **5. Comments** 

- #### اصول کامنت‌گذاری (Commenting Principles)

  - کامنت‌ها باید **دلیل ** انجام کار را توضیح دهند، نه صرفاً **نحوه یا کاری که کد انجام می‌دهد **.
  - تا حد امکان از **کد خوانا ** استفاده کنید و از نوشتن کامنت‌های غیرضروری خودداری نمایید.
  - کامنت‌ها باید همواره با کد همگام باشند؛ در صورت تغییر کد، کامنت‌های مرتبط نیز باید به‌روزرسانی یا حذف شوند.
  - نگهداری **کد کامنت‌شده ** در مخزن پروژه مجاز نیست؛ از تاریخچه گیت برای بازیابی نسخه‌های قبلی استفاده شود.
  - از کامنت ها میتونین برای نوشتن تسک برای خودتون استفاده کنین. (`TODO`)
  - از `TODO` فقط برای کارهای مشخص و برنامه‌ریزی‌شده استفاده شود و توضیح کافی درباره اقدام موردنظر ارائه گردد.
  - در صورت امکان، با انتخاب نام‌های مناسب برای کلاس‌ها، متدها، متغیرها و ثابت‌ها، نیاز به کامنت کاهش یابد.
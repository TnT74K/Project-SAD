در ادامه یک روش مرحله‌به‌مرحله (با توضیح و مثال) برای کلون کردن مخزن و آماده کردن آن روی کامپیوتر (هم برای macOS و هم برای Windows) می‌بینی. در پایان هم خلاصه‌ی تمام دستورات را جدا آورده‌ام.

---

## ۱. پیش‌نیازها

### ۱.۱. نصب Git

#### روی macOS
1. ترمینال را باز کنید (Terminal).
2. اگر Git نصب نیست، یکی از این دو روش را انجام دهید:

**روش ۱ (ساده):**  
اگر `xcode-select` نصب نباشد، با اجرای دستور زیر، Git همراه با Xcode Command Line Tools نصب می‌شود:

```bash
xcode-select --install
```

**روش ۲ (مستقیم):**  
یا از سایت رسمی Git برای macOS دانلود و نصب کنید:  
https://git-scm.com/downloads

بعد از نصب، نسخه‌ی Git را چک کنید:

```bash
git --version
```

خروجی مثلاً باید چیزی شبیه این باشد:

```bash
git version 2.44.0
```

---

#### روی Windows
1. به سایت Git بروید و نسخه‌ی Windows را دانلود کنید:  
   https://git-scm.com/download/win  
2. نصاب (Installer) را اجرا و گزینه‌ها را در حالت پیش‌فرض رها کنید (مگر این‌که تنظیم خاصی بخواهید).  
3. بعد از نصب، **Git Bash** و **Command Prompt** هر دو می‌توانند استفاده شوند. پیشنهاد: Git Bash.

بررسی نسخه:

```bash
git --version
```

---

## ۲. تنظیم نام و ایمیل Git (فقط یک بار برای هر سیستم)

اگر قبلاً تنظیم نکرده‌اید:

```bash
git config --global user.name "نام شما"
git config --global user.email "ایمیل_گیت_شما@example.com"
```

برای اطمینان:

```bash
git config --global --list
```

---

## ۳. داشتن دسترسی به مخزن روی GitLab

شما گفتید:  
> همه اکانت دارن و در سمت سرور، عضو مخزن هستند.

پس فقط کافیست هنگام کلون، نام کاربری و رمز عبور (یا توکن) خودتان را وارد کنید.

---

## ۴. رفتن به پوشه‌ای که می‌خواهید پروژه در آن قرار بگیرد

### macOS (Terminal)
مثال: می‌خواهید پروژه را در پوشه‌ی `Projects` در دسکتاپ قرار دهید:

```bash
cd ~/Desktop
mkdir -p Projects
cd Projects
```

### Windows (Git Bash یا CMD/PowerShell)

**در Git Bash:**

```bash
cd ~/Desktop
mkdir -p Projects
cd Projects
```

**در Command Prompt:**

```cmd
cd %USERPROFILE%\Desktop
mkdir Projects
cd Projects
```

**در PowerShell:**

```powershell
cd $HOME\Desktop
mkdir Projects
cd Projects
```

---

## ۵. کلون کردن مخزن با HTTPS

آدرس مخزن شما:

```text
https://gitlab.aranserver.com/SajadSK/reservecenter.git
```

### دستور کلون (هم macOS و هم Windows)

در ترمینال (یا Git Bash) که در پوشه‌ی مقصد هستید:

```bash
git clone https://gitlab.aranserver.com/SajadSK/reservecenter.git
```

در اولین اجرا، Git از شما **نام کاربری (Username)** و **رمز عبور** (یا Token) GitLab را می‌پرسد:

- Username: همان یوزری که روی `gitlab.aranserver.com` دارید.
- Password:  
  - اگر GitLab اجازه می‌دهد، همان رمز عبور حساب.  
  - اگر از **Personal Access Token** استفاده می‌کنید، همان توکن را به‌جای پسورد وارد کنید.

بعد از ورود موفق، مخزن در پوشه‌ای به نام `reservecenter` ساخته می‌شود.

---

## ۶. ورود به پوشه‌ی پروژه

```bash
cd reservecenter
```

برای بررسی این‌که مخزن درست کلون شده:

```bash
git status
```

خروجیِ معمول:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

(اسم برنچ ممکن است `main` یا `master` یا چیز دیگر باشد.)

---

## ۷. بررسی ریموت (remote) تنظیم شده

برای اطمینان از این‌که لینک ریموت درست تنظیم شده:

```bash
git remote -v
```

خروجی باید شبیه این باشد:

```text
origin  https://gitlab.aranserver.com/SajadSK/reservecenter.git (fetch)
origin  https://gitlab.aranserver.com/SajadSK/reservecenter.git (push)
```

اگر به هر دلیلی اشتباه بود، می‌توانید اصلاح کنید:

```bash
git remote set-url origin https://gitlab.aranserver.com/SajadSK/reservecenter.git
```

---

## ۸. گرفتن آخرین تغییرات (در صورت نیاز)

اگر بعداً کسی تغییرات جدیدی پوش کرده باشد، شما برای به‌روز شدن پروژه:

```bash
git pull
```

یا اگر برنچ اصلی `main` است:

```bash
git pull origin main
```

---

## ۹. مثال کامل از اول تا آخر (macOS)

فرض کنیم روی دسکتاپ، پوشه‌ای به نام `Projects` ندارید:

```bash
# رفتن به دسکتاپ
cd ~/Desktop

# ساخت پوشه پروژه‌ها
mkdir -p Projects

# ورود به پوشه پروژه‌ها
cd Projects

# کلون کردن مخزن
git clone https://gitlab.aranserver.com/SajadSK/reservecenter.git

# ورود به پوشه‌ی مخزن
cd reservecenter

# چک وضعیت مخزن
git status

# چک کردن ریموت
git remote -v
```

---

## ۱۰. مثال کامل از اول تا آخر (Windows با Git Bash)

```bash
# رفتن به Desktop
cd ~/Desktop

# ساخت پوشه پروژه‌ها
mkdir -p Projects

# ورود به پوشه پروژه‌ها
cd Projects

# کلون کردن مخزن
git clone https://gitlab.aranserver.com/SajadSK/reservecenter.git

# ورود به پوشه‌ی مخزن
cd reservecenter

# چک وضعیت
git status

# چک ریموت
git remote -v
```

اگر از Command Prompt استفاده می‌کنید:

```cmd
cd %USERPROFILE%\Desktop
mkdir Projects
cd Projects
git clone https://gitlab.aranserver.com/SajadSK/reservecenter.git
cd reservecenter
git status
git remote -v
```

---

## ۱۱. خلاصه‌ی دستورات (چک‌لیست نهایی)

### فقط یک بار (تنظیمات عمومی Git)

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

### برای هر سیستم (هر بار که روی سیستم جدید ستاپ می‌کنید)

**macOS:**

```bash
xcode-select --install    # در صورت نیاز
git --version
```

**Windows:**

- نصب از https://git-scm.com/download/win  
- سپس:

```bash
git --version
```


### هر بار که می‌خواهید مخزن را کلون کنید

1. رفتن به پوشه‌ی مقصد:

**macOS / Git Bash:**

```bash
cd ~/Desktop
mkdir -p Projects
cd Projects
```

**Windows / CMD:**

```cmd
cd %USERPROFILE%\Desktop
mkdir Projects
cd Projects
```

2. کلون کردن مخزن:

```bash
git clone https://gitlab.aranserver.com/SajadSK/reservecenter.git
```

3. ورود به پوشه‌ی پروژه:

```bash
cd reservecenter
```

4. بررسی وضعیت و ریموت:

```bash
git status
git remote -v
```

5. به‌روز کردن مخزن بعداً (در صورت نیاز):

```bash
git pull
# یا:
git pull origin main    # اگر برنچ اصلی main است
```

---

اگر بخواهی، در پیام بعدی می‌توانم مراحل بعد از کلون (مثلاً نصب dependencyها، اجرای پروژه، ساخت برنچ جدید و پوش‌کردن تغییرات) را هم به همین شکل لیست‌وار برایتان بنویسم.
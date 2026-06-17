# Frontend Fix(1405/3/22)

## Fix: Part One(05/3/22)

Deadline: 1405/3/23

Division table:

|                 Page to improve                 | Description                                                  |   Responsible    | Branch  |   Status    |
| :---------------------------------------------: | ------------------------------------------------------------ | :--------------: | :-----: | :---------: |
|                    register                     | `Apply`: remove national ID; remove name/last name           |      Hamed       | develop |    Done     |
|                Password restore                 | `Add`: Restore with OTP + phone number; `remove`: Restore with national ID, etc. |      Hamed       | develop |    Done     |
|                      Login                      | `Apply`: Two methods: 1) Phone number + Password 2) OTP + phone number |      Hamed       | develop |    Done     |
|                    Homepage                     | `Add`: Apply animations; `Add`: new temporary homepage after user login; ` Fix`: page does not navigate user when pressing enter in search field; | Mohammad Hossein | develop | In progress |
| Appointment list page for ORG Support ORG Admin | `Add`: باز شدن مودال وقتی روی اسم کاربر میزنیم. که اونجا کد نوبت و شماره تماس مشتری رو نشون بده |       Ali        | develop |    Done     |
|              ORG profile edit page              | `Fix`: They can't set price for their appointments!          |     Abolfazl     | develop |    Done     |

## Fix: Part Two (05/3/25)

| Page to improve | Description                                                  |   Responsible    | Branch  | Status |
| :-------------: | ------------------------------------------------------------ | :--------------: | :-----: | :----: |
|   Search page   | `Add`: فیلتر برای کسب و کارهای برتر                          | Mohammad Hossein | develop |  Open  |
|     Footer      | `Add`: Mock emails + support numbers                         |     Abolfazl     | develop |  Done  |
|    Homepage     | `Fix`: change homepage 'new ORGs' page profile images to a default image. | Mohammad Hossein |         |  Open  |

## Fix: Part Three (05/3/26) and (05/3/27)

|      Page to improve      | Description                                                  |   Responsible    |     Branch      |   Status    |
| :-----------------------: | ------------------------------------------------------------ | :--------------: | :-------------: | :---------: |
|        Login page         | `Add`: Role selection modal; Opens **If** the user has more than 1 role. |      Hamed       |     develop     |    Done     |
|         Homepage          | `add` "Recent ADs" section below 'new ORGs' section.         | Mohammad Hossein |     develop     |    Open     |
|      All dashboards       | `add`: new nav bar having buttons to access lists.           |     Abolfazl     |     develop     | In progress |
|        Search-page        | `remove`: تعداد نظرات هر سازمان که روی کارتش نوشته شده       | Mohammad Hossein |     develop     |    Open     |
|      All dashboards       | `Fix`: nav bar still shows login / register                  |     Abolfazl     |     develop     | In progress |
|     `New`:  About Us      | `Add`: give a small description about the system             |       Ali        | Front/InfoPages |    Open     |
| `New`: ORG register guide | `Add`: from homepage, they can enter this page; We explain how to register a business and tell them about the rules. |       Ali        | Front/InfoPages |    Open     |
|         All pages         | Connect all pages together in the new folder structure       |     Abolfazl     | Front/new-names | In progress |
|         All pages         | `Add`: One separate CSS for all fonts. Update the refs to match that file. |     Abolfazl     | Front/new-names | In progress |

## Fix: Part Four(~05/3/28)

|          Page to improve           | Description                                                  |   Responsible    |   Branch   | Status |
| :--------------------------------: | ------------------------------------------------------------ | :--------------: | :--------: | :----: |
| Login / Register / Forgot password | `Idea`:  Appearance that users can better distinguish        |      Hamed       |  develop   |  ???   |
|              Homepage              | `Idea`: راهنمای ثبت نوبت بذاریم                              | Mohammad Hossein |  develop   |  ???   |
|             All pages              | `Add`: dark mode                                             |       Team       | Front/Dark |  ???   |
|             My-profile             | `Fix` : ثبت ستاره روی نوبت ها کار نمیکنه                     | Mohammad hossein |  develop   |  Open  |
|             OG profile             | `Add`: اگر نوبت جدید کاربر با نوبت‌های قبلی خودش تداخل داشت خطا نشون بده |    Abolfazl?     |  develop   |  Open  |
|           Ad-management            | `Add`: Search feature; `Add`: links pointing to ORG public profile | Mohammad hossein |  develop   |  Open  |

## Fix: Part Five (not planned)

|    Page to improve    | Description                                                  | Responsible | Branch |        Status        |
| :-------------------: | ------------------------------------------------------------ | :---------: | :----: | :------------------: |
| ORG profile edit page | `Fix` : User can make new appointment for previous days!!; `Fix`: If the user sets a new appointment at 20th of Khordad, It will make a new row. `Fix`: Font for "تومان" is missing. `Fix`: عنوان فیلد قیمت، در مودال ویرایش نوبت، نمایش داده نمیشه. |  Abolfazl   |        |                      |
|   appointment-list    | `Fix`: فرمت کد نوبت با فرمت صفحه پروفایل سازمان از دید مشتری(همونجایی نوبت میگیره) فرق داره |     Ali     |        |                      |
|  `new` AD view page   | Opens after the user clicks on "مشاهده بیشتر" button of 'تخفیف ها' section. |    Ali?     |        | Task will be removed |

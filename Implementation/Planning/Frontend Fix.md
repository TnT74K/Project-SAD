# Frontend Fix List

### For CSharpers team

- اسم صفحات براساس آنچه در شاخه `main` موجود است نوشته شده.
- ساختار متن از چپ به راست است

## Fix: Part One(05/3/22)

Deadline: 1405/3/23

Division table:

|                 Page to improve                 | Description                                                  |   Responsible    | Priority |   Status    |
| :---------------------------------------------: | ------------------------------------------------------------ | :--------------: | :------: | :---------: |
|                    register                     | `Apply`: remove national ID; remove name/last name           |      Hamed       |   High   |    Done     |
|                Password restore                 | `Add`: Restore with OTP + phone number; `remove`: Restore with national ID, etc. |      Hamed       |   High   |    Done     |
|                      Login                      | `Apply`: Two methods: 1) Phone number + Password 2) OTP + phone number |      Hamed       |   High   |    Done     |
|                    Homepage                     | `Add`: Apply animations; `Add`: new temporary homepage after user login; ` Fix`: page does not navigate user when pressing enter in search field; | Mohammad Hossein |   High   | In progress |
| Appointment list page for ORG Support ORG Admin | `Add`: باز شدن مودال وقتی روی اسم کاربر میزنیم. که اونجا کد نوبت و شماره تماس مشتری رو نشون بده |       Ali        |   High   |    Done     |
|              ORG profile edit page              | `Fix`: They can't set price for their appointments!          |     Abolfazl     |   High   |    Done     |

## Fix: Part Two (05/3/25)

| Page to improve | Description                                                  |   Responsible    | Priority | Status |
| :-------------: | ------------------------------------------------------------ | :--------------: | :------: | :----: |
|   Search page   | `Add`: فیلتر برای کسب و کارهای برتر                          | Mohammad Hossein |  Medium  | Cancel |
|     Footer      | `Add`: Mock emails + support numbers                         |     Abolfazl     |  Medium  |  Done  |
|    Homepage     | `Fix`: change homepage 'کسب و کارهای جدید' profile images to a default image. | Mohammad Hossein |   High   |  Done  |

## Fix: Part Three (05/3/26) and (05/3/27)

|      Page to improve      | Description                                                  |   Responsible    | Priority | Status |
| :-----------------------: | ------------------------------------------------------------ | :--------------: | :------: | :----: |
|        Login page         | `Add`: Role selection modal; Opens **If** the user has more than 1 role. |      Hamed       |   High   |  Done  |
|         Homepage          | `add` "Recent ADs" section below 'new ORGs' section.         | Mohammad Hossein |   High   |  Done  |
|      All dashboards       | `add`: new nav bar having buttons to access lists.           |     Abolfazl     |   High   |  Done  |
|                           |                                                              |                  |          |        |
|      All dashboards       | `Fix`: nav bar still shows login / register                  |     Abolfazl     |   High   |  Done  |
|     `New`:  About Us      | `Add`: give a small description about the system             |       Ali        |  Medium  |  Done  |
| `New`: ORG register guide | `Add`: from homepage, they can enter this page; We explain how to register a business and tell them about the rules. |       Ali        |  Medium  |  Done  |
|         All pages         | Connect all pages together in the new folder structure branch |     Abolfazl     |   High   |  Done  |
|         All pages         | `Add`: One separate CSS for all fonts. Update the refs to match that file. |     Abolfazl     |   High   |  Done  |

## Fix: Part Four (05/3/28-05/03/29)

| Page to improve | Description                                                  |   Responsible    | Priority | Status |
| :-------------: | ------------------------------------------------------------ | :--------------: | :------: | :----: |
|    Homepage     | `Idea`: راهنمای ثبت نوبت بذاریم                              | Mohammad Hossein |   Low    |  Done  |
|    All pages    | `Add`: dark mode in `Front/dark` branch.                     |       Team       |   Low    | Cancel |
|   My-profile    | `Fix` : ثبت ستاره روی نوبت ها کار نمیکنه                     | Mohammad hossein |   Low    | Cancel |
|  Ad-management  | `Add`: Search feature; `Add`: links pointing to ORG public profile | Mohammad hossein |   Low    |  Open  |

## Fix: Part Five (05/3/29)

|    Page to improve    | Description                                                  | Responsible | Priority |       Status        |
| :-------------------: | ------------------------------------------------------------ | :---------: | :------: | :-----------------: |
| ORG profile edit page | `Fix` : User can make new appointment for previous days!!; `Fix`: Font for "تومان" is missing -> use Vazirmatn. `Fix`: عنوان فیلد قیمت، در مودال ویرایش نوبت، نمایش داده نمیشه. |  Abolfazl   |   High   |     In progress     |
|  `new` AD view page   | Opens after the user clicks on "مشاهده بیشتر" button of 'تخفیف ها' section. |    -----    |  -----   | Task may be removed |
|       All pages       | `Fix`: All numbers be in English                             |  Abolfazl   |  Medium  |        Done         |
|       All pages       | `Apply`: Coordinate all mock data to match.                  |    Sajad    |  Medium  |       Cancel        |

## Fix: Part Six (05/3/30)

| Page to improve    | Description                                                  | Responsible      | Priority | Status |
| ------------------ | ------------------------------------------------------------ | ---------------- | -------- | ------ |
| ORG Profile        | `Fix`: Tapping on TimeSections does not show appointment price | Abolfazl         | High     | Done   |
| appointment-list   | `Fix`: فرمت کد نوبت با فرمت صفحه پروفایل سازمان از دید مشتری(همونجایی نوبت میگیره) فرق داره | Sajad            | High     | Open   |
| ORG Public Profile | `Add`: Editing the horizontal list 'نوع خدمات'               | Abolfazl         | High     | Done   |
| ORG Profile Edit   | `Add`: A horizontal list of the types of service the ORG can do for customers. It's name is 'نوع' | Abolfazl         | High     | Done   |
| user profile       | `Fix`: numbers of appointments are not working.              | Mohammad Hossein | Medium   | Cancel |
| User profile       | `Fix`: icons to match the website                            | Sajad            | Medium   | Cancel |

## *Fix: Part Seven(05/3/31-05/4/1)*

| Page to improve    | Description                                                  | Responsible      | Priority | Status     |
| ------------------ | ------------------------------------------------------------ | ---------------- | -------- | ---------- |
| Org register form  | `Apply`: Background to be like hero section background in index page; `Apply`: Make form titles bigger | Mohammad Hossein | Medium   | Open       |
| All pages          | Numbers to be in Persian except clock and statistics         | Ali              | Low      | Unapproved |
| homepage           | `Fix`: Tapping on categories does not redirect to search page | Ali              | Medium   | Open       |
| Search-page        | `remove`: تعداد نظرات هر سازمان که روی کارتش نوشته شده; `Add`: تعداد امتیاز دهنده | Mohammad Hossein | Medium   | Open       |
| Org public profile | `Add`: تعداد امتیاز دهنده؛ امتیاز کسب و کار؛ تعداد نوبت موفقش؛ اینکه کسب‌وکار برتر هست یا نه | Abolfazl?        | Medium   | Unapproved |


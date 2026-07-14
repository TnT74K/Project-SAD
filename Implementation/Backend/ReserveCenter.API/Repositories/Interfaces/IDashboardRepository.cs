using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
        // برای گرفتن نقش کاربر در ان سازمان که با اینکلود ها می توان به نام سازمان و نام فرد و نقشش برسیم
        Task<StaffList> GetByOrgIdAsync(int orgId);

        // کل رزرو ها تا به الان برای این سازمان
        Task<int> CountAllAppointmentByOrgIdAsync(int orgId);

        // امتیاز سازمان
        Task<decimal> GetOrgStarByOrgIdAsync(int orgId);

        // تعداد امتیاز دهنده ها
        Task<int> GetVoterCountByOrgIdAsync(int orgId);

        // تعداد رزرو های امروز
        Task<int> CountTodayReservedAppointmentByOrgIdAsync(int orgId);

        // تعداد رزرو های دیروز
        Task<int> CountYesterdayReservedAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های حضور یافته امروز
        Task<int> CountTodayPresencedAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های حضور یافته دیروز
        Task<int> CountYesterdayPresencedAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های لغو شده امروز
        Task<int> CountTodayCanceledAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های لغو شده دیروز
        Task<int> CountYesterdayCanceledAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های عدم حضور امروز
        Task<int> CountTodayAbsentedAppointmentByOrgIdAsync(int orgId);

        // تعداد نوبت های عدم حضور دیروز
        Task<int> CountYesterdayAbsentedAppointmentByOrgIdAsync(int orgId);
    }
}

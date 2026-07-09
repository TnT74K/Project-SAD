using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces
{
    public interface ISuperAdminDashboardRepository
    {
        // برای گرفتن نقش کاربر در ان سازمان که با اینکلود ها می توان به نام سازمان و نام فرد و نقشش برسیم
        Task<StaffList> GetByOrgIdAsync(int orgId);

        // کل رزرو ها تا به الان برای همه سازمان ها
        Task<int> CountAllAppointmentAsync();

        // تعداد رزرو های امروز
        Task<int> CountTodayReservedAppointmentAsync();

        // تعداد رزرو های دیروز
        Task<int> CountYesterdayReservedAppointmentAsync();

        // تعداد نوبت های حضور یافته امروز
        Task<int> CountTodayPresencedAppointmentAsync();

        // تعداد نوبت های حضور یافته دیروز
        Task<int> CountYesterdayPresencedAppointmentAsync();

        // تعداد نوبت های لغو شده امروز
        Task<int> CountTodayCanceledAppointmentAsync();

        // تعداد نوبت های لغو شده دیروز
        Task<int> CountYesterdayCanceledAppointmentAsync();

        // تعداد نوبت های عدم حضور امروز
        Task<int> CountTodayAbsentedAppointmentAsync();

        // تعداد نوبت های عدم حضور دیروز
        Task<int> CountYesterdayAbsentedAppointmentAsync();
    }
}

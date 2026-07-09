using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ReserveCenter.API.Repositories.Implementations
{
    public class SuperAdminDashboardRepository : ISuperAdminDashboardRepository
    {
        private readonly ReserveCenterDBContext _dbContext;

        public SuperAdminDashboardRepository(ReserveCenterDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // کل رزرو ها تا به الان برای همه سازمان ها
        public async Task<int> CountAllAppointmentAsync()
        {
            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo => appo.IsReserved == true);
        }

        // تعداد نوبت های عدم حضور امروز
        public async Task<int> CountTodayAbsentedAppointmentAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Absented &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های لغو شده امروز
        public async Task<int> CountTodayCanceledAppointmentAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Canceled &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های حضور یافته امروز
        public async Task<int> CountTodayPresencedAppointmentAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Presenced &&
                                        appo.AppointmentDate == today);
        }

        // تعداد رزرو های امروز
        public async Task<int> CountTodayReservedAppointmentAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.IsReserved == true &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های عدم حضور دیروز
        public async Task<int> CountYesterdayAbsentedAppointmentAsync()
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Absented &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد نوبت های لغو شده دیروز
        public async Task<int> CountYesterdayCanceledAppointmentAsync()
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Canceled &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد نوبت های حضور یافته دیروز
        public async Task<int> CountYesterdayPresencedAppointmentAsync()
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Presenced &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد رزرو های دیروز
        public async Task<int> CountYesterdayReservedAppointmentAsync()
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.IsReserved == true &&
                                        appo.AppointmentDate == yesterday);
        }

        // برای گرفتن نقش کاربر در ان سازمان که با اینکلود ها می توان به نام سازمان و نام فرد و نقشش برسیم
        public async Task<StaffList> GetByOrgIdAsync(int orgId)
        {
            return await _dbContext.StaffLists
                                   .AsNoTracking()
                                   .Include(appo => appo.Role)
                                   .Include(appo => appo.User)
                                   .Include(appo => appo.Org)
                                   .FirstOrDefaultAsync(x => x.OrgId == orgId);
        }

    }
}

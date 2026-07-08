using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ReserveCenter.API.Repositories.Implementations
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ReserveCenterDBContext _dbContext;

        public DashboardRepository(ReserveCenterDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // کل رزرو ها تا به الان برای این سازمان
        public async Task<int> CountAllAppointmentByOrgIdAsync(int orgId)
        {
            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo => appo.OrgId == orgId && appo.IsReserved == true);
        }

        // تعداد نوبت های عدم حضور امروز
        public async Task<int> CountTodayAbsentedAppointmentByOrgIdAsync(int orgId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Absented &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های لغو شده امروز
        public async Task<int> CountTodayCanceledAppointmentByOrgIdAsync(int orgId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Canceled &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های حضور یافته امروز
        public async Task<int> CountTodayPresencedAppointmentByOrgIdAsync(int orgId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Presenced &&
                                        appo.AppointmentDate == today);
        }

        // تعداد رزرو های امروز
        public async Task<int> CountTodayReservedAppointmentByOrgIdAsync(int orgId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.IsReserved == true &&
                                        appo.AppointmentDate == today);
        }

        // تعداد نوبت های عدم حضور دیروز
        public async Task<int> CountYesterdayAbsentedAppointmentByOrgIdAsync(int orgId)
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Absented &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد نوبت های لغو شده دیروز
        public async Task<int> CountYesterdayCanceledAppointmentByOrgIdAsync(int orgId)
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Canceled &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد نوبت های حضور یافته دیروز
        public async Task<int> CountYesterdayPresencedAppointmentByOrgIdAsync(int orgId)
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
                                        appo.AppointmentStatusId == (int)AppointmentStatuseEnum.Presenced &&
                                        appo.AppointmentDate == yesterday);
        }

        // تعداد رزرو های دیروز
        public async Task<int> CountYesterdayReservedAppointmentByOrgIdAsync(int orgId)
        {
            var yesterday = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

            return await _dbContext.Appointments
                                   .AsNoTracking()
                                   .CountAsync(appo =>
                                        appo.OrgId == orgId &&
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

        // امتیاز سازمان
        public async Task<decimal> GetOrgStarByOrgIdAsync(int orgId)
        {
            var org = await _dbContext.Orgs
                .FirstOrDefaultAsync(existing => existing.Id == orgId);

            if (org is null)
            {
                return 0;
            }

            return org.StarCount;
        }

        // تعداد امتیاز دهنده ها
        public async Task<int> GetVoterCountByOrgIdAsync(int orgId)
        {
            var org = await _dbContext.Orgs
                .FirstOrDefaultAsync(existing => existing.Id == orgId);

            if (org is null)
            {
                return 0;
            }

            return org.VoterCount;
        }
    }
}

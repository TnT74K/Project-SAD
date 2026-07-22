using Azure.Core;
using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Repositories.Interfaces;
using System.Security.Cryptography;

namespace ReserveCenter.API.Repositories.Implementations;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly ReserveCenterDBContext _dbContext;

    public AppointmentRepository(ReserveCenterDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Appointment> AddAsync(Appointment appointment)
    {
        await _dbContext.Appointments.AddAsync(appointment);
        await _dbContext.SaveChangesAsync();

        return appointment;
    }

    //برای گرفتن لیست نوبت های مربوط به کسب و کار مدنظر
    public async Task<List<Appointment>> AppointmentListByOrgIdAsync(int orgId)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
                               .Include(appo => appo.AppointmentStatus)
                               .Include(appo => appo.BookingUser)
                               .Include(appo => appo.Org)
                               .Include(appo => appo.Orgservice)
                               .Where(service => service.OrgId == orgId)
                               .OrderBy(service => service.Id)
                               .ToListAsync();
    }

    // 
    public async Task<List<Appointment>> GetByServiceAndDateAsync(int serviceId,DateOnly date)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
                               .Include(appo => appo.AppointmentStatus)
                               .Include(appo => appo.BookingUser)
                               .Include(appo => appo.Org)
                               .Include(appo => appo.Orgservice)
                               .Where(service => service.OrgserviceId == serviceId && service.AppointmentDate == date)
                               .OrderBy(service => service.Id)
                               .ToListAsync();
    }

    public async Task<bool> DeleteAsync(int appintmentId)
    {
        var appointment = await _dbContext.Appointments
            .FirstOrDefaultAsync(existing => existing.Id == appintmentId);

        if (appointment is null)
        {
            return false;
        }

        _dbContext.Appointments.Remove(appointment);

        await _dbContext.SaveChangesAsync();

        return true;
    }

    //برای گرفتن یک نوبت بر اساس ای دی ان
    public async Task<Appointment?> GetByIdAsync(int appointmentId)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
                               .Include(appo => appo.AppointmentStatus)
                               .Include(appo => appo.BookingUser)
                               .Include(appo => appo.Org)
                               .Include(appo => appo.Orgservice)
                               .FirstOrDefaultAsync(appointment => appointment.Id == appointmentId);
    }

    public async Task<bool> UpdateAsync(Appointment appointment)
    {
        var existingAppointment = await _dbContext.Appointments.FirstOrDefaultAsync(existing => existing.Id == appointment.Id);

        if (existingAppointment is null)
        {
            return false;
        }

        existingAppointment.OrgId = appointment.OrgId;
        existingAppointment.AppointmentDate = appointment.AppointmentDate;
        existingAppointment.AppointmentTime = appointment.AppointmentTime;
        existingAppointment.Price = appointment.Price;
        existingAppointment.OrgserviceId = appointment.OrgserviceId;
        existingAppointment.BookingUserId = appointment.BookingUserId;
        existingAppointment.BookingConfirmCode = appointment.BookingConfirmCode;
        existingAppointment.IsReserved = appointment.IsReserved;
        existingAppointment.AppointmentStatusId = appointment.AppointmentStatusId;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<Appointment?> GetByTrackingCodeAsync(string trackingCode)
    {
        return await _dbContext.Appointments
                               .Include(a => a.Org)
                               .Include(a => a.Orgservice)
                               .Include(a => a.BookingUser)
                               .Include(a => a.AppointmentStatus)
                               .FirstOrDefaultAsync(a => a.BookingConfirmCode == trackingCode);
    }

    public async Task<List<Appointment>?> GetAppointmentsByDateAsync(int orgId, DateOnly date)
    {
        return await _dbContext.Appointments
                    .AsNoTracking()
                    .Include(a => a.AppointmentStatus)
                    .Include(a => a.BookingUser)
                    .Include(a => a.Org)
                    .Include(a => a.Orgservice)
                    .Where(a => a.OrgId == orgId && a.AppointmentDate == date)
                    .OrderBy(a => a.AppointmentTime)
                    .ToListAsync();
    }

    public async Task<List<Appointment>?> GetAppointmentsByDateRangeAsync(int orgId, DateOnly startDate, DateOnly endDate)
    {
        return await _dbContext.Appointments
                    .AsNoTracking()
                    .Include(a => a.AppointmentStatus)
                    .Include(a => a.BookingUser)
                    .Include(a => a.Org)
                    .Include(a => a.Orgservice)
                    .Where(a => a.OrgId == orgId &&
                                a.AppointmentDate >= startDate &&
                                a.AppointmentDate <= endDate)
                    .OrderBy(a => a.AppointmentDate)
                    .ThenBy(a => a.AppointmentTime)
                    .ToListAsync();
    }

    public async Task<Appointment?> GetConflictAppointmentAsync(int serviceId, DateOnly appointmentDate, TimeOnly appointmentTime)
    {
        return await _dbContext.Appointments
                    .FirstOrDefaultAsync(a => a.OrgserviceId == serviceId &&
                                               a.AppointmentDate == appointmentDate &&
                                               a.AppointmentTime == appointmentTime &&
                                               a.IsReserved);
    }
}

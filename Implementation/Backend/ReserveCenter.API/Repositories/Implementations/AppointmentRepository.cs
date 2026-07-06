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

    public async Task<List<Appointment>> AppointmentListByOrgIdAsync(int orgId)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
                               .Where(service => service.OrgId == orgId)
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

    public async Task<Appointment?> GetByIdAsync(int appointmentId)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
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
}

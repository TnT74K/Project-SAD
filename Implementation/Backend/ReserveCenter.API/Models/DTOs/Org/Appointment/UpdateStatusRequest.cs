using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Appointment
{
    public class UpdateStatusRequest
    {
        [Required(ErrorMessage = "شناسه نوبت الزامی است")]
        public int AppointmentId { get; set; }

        [Required(ErrorMessage = "شناسه وضعیت جدید الزامی است")]
        public int AppointmentStatusId { get; set; }
    }
}
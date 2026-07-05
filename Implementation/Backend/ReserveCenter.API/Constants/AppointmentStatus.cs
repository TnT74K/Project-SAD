namespace ReserveCenter.API.Constants
{
    public static class AppointmentStatus
    {
        public const string Pending = "Pending";     // در انتظار تایید
        public const string Confirmed = "Confirmed"; // تایید شده
        public const string Completed = "Completed"; // تکمیل شده
        public const string Cancelled = "Cancelled"; // لغو شده
        public const string Rejected = "Rejected";   // رد شده
    }
}
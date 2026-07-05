namespace ReserveCenter.API.Constants
{
    public static class Roles
    {
        public const string Admin = "Admin";             // مدیرکل سیستم
        public const string Organization = "Organization"; // مدیر کسب‌وکار
        public const string Support = "Support";         // پشتیبان کسب‌وکار
        public const string Staff = "Staff";             // کارمند حضوری

        // بررسی معتبر بودن نقش
        public static bool IsValidRole(string role)
        {
            return role == Admin || role == Organization || role == Support || role == Staff;
        }
    }
}
namespace ReserveCenter.API.Constants
{
    public static class Roles
    {
        public const string Admin = "Admin";           // مدیرکل سیستم
        public const string User = "User";             // کاربر عادی
        public const string Staff = "Staff";           // کارمند سازمان
        public const string Organization = "Organization"; // سازمان

        // بررسی معتبر بودن نقش
        public static bool IsValidRole(string role)
        {
            return role == Admin || role == User || role == Staff || role == Organization;
        }
    }
}
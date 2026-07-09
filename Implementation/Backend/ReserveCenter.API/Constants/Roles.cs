using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Constants
{
    public static class Roles
    {
        public const string Customer = "Customer";         // مشتری
        public const string SuperAdmin = "SuperAdmin";             // مدیرکل سیستم
        public const string OrgAdmin = "OrgAdmin"; // مدیر کسب‌وکار
        public const string Support = "Support";         // پشتیبان کسب‌وکار
        public const string Staff = "Staff";
        public static readonly Dictionary<int, string> RoleNames = new()
        {
            { 5, Customer }, // It's null in database
            { 4, Staff },
            { 3, Support },
            { 2, OrgAdmin },
            { 1, SuperAdmin }
        };

        public static bool IsValidRole(string role)
        {
            return RoleNames.ContainsValue(role);
        }
    }
}
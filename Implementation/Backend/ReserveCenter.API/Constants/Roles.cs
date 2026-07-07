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
            { 1, Customer },
            { 2, Staff },
            { 3, Support },
            { 4, OrgAdmin },
            { 5, SuperAdmin }
        };

        public static bool IsValidRole(string role)
        {
            return RoleNames.ContainsValue(role);
        }
    }
}
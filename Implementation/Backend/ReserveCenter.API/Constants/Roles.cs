using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Constants
{
    public static class Roles
    {
        public const string User = "User";
        public const string SuperAdmin = "SuperAdmin";             // مدیرکل سیستم
        public const string OrgAdmin = "OrgAdmin"; // مدیر کسب‌وکار
        public const string Support = "Support";         // پشتیبان کسب‌وکار
        public const string Staff = "Staff";
        public static readonly Dictionary<string, int> RoleIds = new()
        {
            { User, 1 },
            { Staff, 2 },
            { Support, 3 },
            { OrgAdmin, 4 },
            { SuperAdmin, 5}

        };

        public static bool IsValidRole(string role)
        {
            return RoleIds.ContainsKey(role);
        }
    }
}
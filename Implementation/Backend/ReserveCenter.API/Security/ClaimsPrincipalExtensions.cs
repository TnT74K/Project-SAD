using System.Security.Claims;

namespace ReserveCenter.API.Security
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetRequiredOrgId(this ClaimsPrincipal user)
        {
            var orgIdClaim = user.FindFirst("OrgId")?.Value;

            if (string.IsNullOrWhiteSpace(orgIdClaim) || !int.TryParse(orgIdClaim, out var orgId))
            {
                throw new UnauthorizedAccessException("شناسه سازمان برای کاربر احراز نشده است.");
            }

            return orgId;
        }

        public static int GetRequiredUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("کاربر احراز هویت نشده است.");
            }

            return userId;
        }
    }
}

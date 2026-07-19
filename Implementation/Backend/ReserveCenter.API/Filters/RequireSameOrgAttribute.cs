using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ReserveCenter.API.Security;

namespace ReserveCenter.API.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class RequireSameOrgAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;

            try
            {
                var currentOrgId = user.GetRequiredOrgId();

                foreach (var argument in context.ActionArguments.Values)
                {
                    if (argument is null)
                    {
                        continue;
                    }

                    if (argument is int routeOrgId && IsOrgRoute(context, routeOrgId))
                    {
                        if (routeOrgId != currentOrgId)
                        {
                            context.Result = new ForbidResult();
                            return;
                        }
                    }

                    var orgIdProperty = argument.GetType().GetProperty("OrgId");
                    if (orgIdProperty?.PropertyType == typeof(int))
                    {
                        var bodyOrgId = (int)(orgIdProperty.GetValue(argument) ?? 0);
                        if (bodyOrgId != 0 && bodyOrgId != currentOrgId)
                        {
                            context.Result = new ForbidResult();
                            return;
                        }
                    }
                }

                if (TryGetOrgRouteValue(context, out var routeValue) && routeValue != currentOrgId)
                {
                    context.Result = new ForbidResult();
                    return;
                }
            }
            catch (UnauthorizedAccessException)
            {
                context.Result = new ForbidResult();
            }
        }

        private static bool IsOrgRoute(ActionExecutingContext context, int routeOrgId)
        {
            return TryGetOrgRouteValue(context, out var parsedOrgId) && parsedOrgId == routeOrgId;
        }

        private static bool TryGetOrgRouteValue(ActionExecutingContext context, out int orgId)
        {
            orgId = default;
            var routeValues = context.RouteData.Values;
            var keys = new[] { "orgId", "OrgId" };

            foreach (var key in keys)
            {
                if (!routeValues.TryGetValue(key, out var value) || value is null)
                {
                    continue;
                }

                if (int.TryParse(value.ToString(), out orgId))
                {
                    return true;
                }
            }

            return false;
        }
    }
}

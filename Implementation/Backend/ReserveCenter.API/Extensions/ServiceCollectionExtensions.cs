/*
    TODO:
    Need to register services here, so that they can be injected into controllers and other services.
    IAuthService
    AuthService
    JwtSettings
    using builder.Configuration
*/
using Microsoft.Extensions.DependencyInjection;
using ReserveCenter.API.Repositories.Implementations;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Implementations;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();

            // Services
            services.AddScoped<IAdminUserListService, AdminUserListService>();

            return services;
        }
    }
}
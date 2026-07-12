using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Settings;
using ReserveCenter.API.Repositories.Implementations;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Implementations;
using ReserveCenter.API.Services.Interfaces;
// =====================================================

namespace ReserveCenter.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Register DbContext
            services.AddDbContext<ReserveCenterDBContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")));

            // ============================
            // Register Repositories
            // ============================
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IOrgRepository, OrgRepository>();
            services.AddScoped<IUnregisteredOrgRepository, UnregisteredOrgRepository>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            //services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IStaffListRepository, StaffListRepository>();
            //services.AddScoped<IAdRepository, AdRepository>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();
            services.AddScoped<ISuperAdminDashboardRepository, SuperAdminDashboardRepository>();
            services.AddScoped<IServiceRepository, ServiceRepository>();


            // ============================
            // Register Services
            // ============================
            //services.AddScoped<IUserService, UserService>();
            services.AddScoped<IOrgService, OrgService>();
            //services.AddScoped<IAppointmentService, AppointmentService>();
            //services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IStaffListService, StaffListService>();
            services.AddScoped<IAuthService, AuthService>();
            //services.AddScoped<IAdminAdService, AdminAdService>();
            //services.AddScoped<IAdminOrgService, AdminOrgService>();
            services.AddScoped<IAdminUserListService, AdminUserListService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<IPublicOrgProfileService, PublicOrgProfileService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IOrgProfileService, OrgProfileService>();
            services.AddScoped<IServiceService, ServiceService>();
            services.AddScoped<IAppointmentListService, AppointmentListService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IOrgSuspendListService, OrgSuspendListService>();

            // ========= JWT section ===========
            services.Configure<JwtSettings>(
                configuration.GetSection("JwtSettings"));

            // To tell ASP.NET "Whenever someone sends a JWT token, validate it using JWT settings"
            var jwtSettings = configuration
                .GetSection("JwtSettings")
                .Get<JwtSettings>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings!.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
                    };
                });

            // setup [Authorize] and [Authorize(Roles = Roles.Admin)]
            services.AddAuthorization();

            return services;
        }
    }
}

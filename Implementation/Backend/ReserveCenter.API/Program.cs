// These are the registeries
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReserveCenter.API.Extensions;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Services.Interfaces;
using ReserveCenter.API.Services.Implementations;
using System.Text;
using ReserveCenter.API.Middlewares;
// JWT configs
using ReserveCenter.API.Models.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
// Database Connection checker
using ReserveCenter.API;
// Repositories
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Repositories.Implementations;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// OpenAPI / Swagger
builder.Services.AddOpenApi();

// Register DbContext
builder.Services.AddDbContext<ReserveCenterDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ============================
// ✅ Register Repositories
// ============================
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOrgRepository, OrgRepository>();
builder.Services.AddScoped<IUnregisteredOrgRepository, UnregisteredOrgRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
//builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IStaffListRepository, StaffListRepository>();
//builder.Services.AddScoped<IAdRepository, AdRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<ISuperAdminDashboardRepository, SuperAdminDashboardRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();

// ============================
// ✅ Register Services
// ============================
//builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrgService, OrgService>();
//builder.Services.AddScoped<IAppointmentService, AppointmentService>();
//builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IStaffListService, StaffListService>();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IAdminAdService, AdminAdService>();
//builder.Services.AddScoped<IAdminOrgService, AdminOrgService>();
//builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IPublicOrgProfileService, PublicOrgProfileService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IOrgProfileService, OrgProfileService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IAppointmentListService, AppointmentListService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

// ========= JWT section ===========
// Register JWT settings
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

// To tell ASP.NET "Whenever someone sends a JWT token, validate it using JWT settings"
var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
// =================

// setup [Authorize] and [Authorize(Roles = Roles.Admin)]
builder.Services.AddAuthorization();

var app = builder.Build();
// ============================
// Database connection checker
// ============================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
DatabaseConnectionChecker.PrintConnectionStatus(connectionString);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication(); // must come before authorizatoin
app.UseAuthorization();

app.MapControllers();

app.Run();
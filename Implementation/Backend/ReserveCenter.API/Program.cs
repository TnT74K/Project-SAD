using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Services.Interfaces;
using ReserveCenter.API.Services.Implementations;
using System.Text;
using ReserveCenter.API.Middlewares;
using ReserveCenter.API.Models.Settings;
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
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
//builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
//builder.Services.AddScoped<IStaffRepository, StaffRepository>();
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
//builder.Services.AddScoped<IStaffService, StaffService>();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IAdminAdService, AdminAdService>();
//builder.Services.AddScoped<IAdminOrgService, AdminOrgService>();
//builder.Services.AddScoped<IAdminUserService, AdminUserService>();
//builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IPublicOrgProfileService, PublicOrgProfileService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IOrgProfileService, OrgProfileService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IAppointmentListService, AppointmentListService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ============================
// ✅ Register JWT settings
// ============================
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
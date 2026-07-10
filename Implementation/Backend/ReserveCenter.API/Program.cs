using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
// Database Connection checker
using ReserveCenter.API;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Middlewares; 
// JWT configs
using ReserveCenter.API.Models.Settings;
using ReserveCenter.API.Services.Interfaces;
using System.Reflection;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// OpenAPI / Swagger
builder.Services.AddOpenApi();

// Register DbContext
builder.Services.AddDbContext<ReserveCenterDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IOrgRepository, OrgRepository>();
//builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
//builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
//builder.Services.AddScoped<IStaffRepository, StaffRepository>();
//builder.Services.AddScoped<IAdRepository, AdRepository>();

// Register services
//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<IOrgService, OrgService>();
//builder.Services.AddScoped<IAppointmentService, AppointmentService>();
//builder.Services.AddScoped<IReviewService, ReviewService>();
//builder.Services.AddScoped<IStaffService, StaffService>();
// builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IAdminAdService, AdminAdService>();
//builder.Services.AddScoped<IAdminOrgService, AdminOrgService>();
//builder.Services.AddScoped<IAdminUserService, AdminUserService>();
//builder.Services.AddScoped<ISearchService, SearchService>();

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
try
{
    app.MapControllers();
}
catch (ReflectionTypeLoadException ex)
{
    foreach (var loaderException in ex.LoaderExceptions)
    {
        Console.WriteLine("❌ ارور پکیج: " + loaderException?.Message);
    }
    throw;
}


app.Run();


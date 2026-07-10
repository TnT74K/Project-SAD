using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReserveCenter.API;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Middlewares;
using ReserveCenter.API.Models.Settings;
// 👇 اضافه کردن دستی فضاهای نام برای اینکه ریپازیتوری‌ها قطعاً شناخته شوند
using ReserveCenter.API.Services.Interfaces;
using ReserveCenter.API.Services.Implementations;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Repositories.Implementations;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 🟢 تنظیمات CORS لایو سرور
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLiveServer",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

// ثبت DbContext
builder.Services.AddDbContext<ReserveCenterDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 🟢 فعال‌سازی مجدد و قطعی سرویس‌ها (این بار قفل تزریق وابستگی باز می‌شود)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ========= JWT section ===========
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });

builder.Services.AddAuthorization();
var app = builder.Build();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
DatabaseConnectionChecker.PrintConnectionStatus(connectionString);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowLiveServer");
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
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
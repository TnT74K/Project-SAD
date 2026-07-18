using Microsoft.AspNetCore.Cors.Infrastructure;
using ReserveCenter.API.Models.Settings;
using Microsoft.Extensions.Options;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.Extensions;
using ReserveCenter.API.Middlewares;
using ReserveCenter.API; // Database Connection checker
// =====================================================

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// All services, JWT, DbContext registrations
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();
// ============================
// Database connection checker
// ============================
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
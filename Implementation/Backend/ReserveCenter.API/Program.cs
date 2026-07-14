using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.Extensions;
using ReserveCenter.API.Middlewares;
using ReserveCenter.API; // Database Connection checker
// =====================================================

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// OpenAPI / Swagger
builder.Services.AddOpenApi();

// All services, JWT, DbContext registrations
builder.Services.AddApplicationServices(builder.Configuration);

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
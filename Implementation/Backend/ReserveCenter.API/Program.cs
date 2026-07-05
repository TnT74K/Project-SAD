using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IAdminAdService, AdminAdService>();
//builder.Services.AddScoped<IAdminOrgService, AdminOrgService>();
//builder.Services.AddScoped<IAdminUserService, AdminUserService>();
//builder.Services.AddScoped<ISearchService, SearchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

//app.MapControllers();

app.Run();

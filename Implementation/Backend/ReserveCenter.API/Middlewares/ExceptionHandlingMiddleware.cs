using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace ReserveCenter.API.Middlewares
{
    /// <summary>
    /// Middleware برای مدیریت یکپارچه خطاها در کل برنامه
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // لاگ خطا با جزئیات کامل
            _logger.LogError(
                exception,
                "❌ خطا در درخواست: {Method} {Path} | StatusCode: {StatusCode} | User: {User}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                context.User?.Identity?.Name ?? "ناشناس");

            // تعیین کد وضعیت بر اساس نوع خطا
            // ✅ ترتیب اهمیت: از خاص‌ترین به عام‌ترین
            var statusCode = exception switch
            {
                // ✅ خاص‌ترین‌ها اول
                ArgumentNullException => StatusCodes.Status400BadRequest,
                FileNotFoundException => StatusCodes.Status404NotFound,
                
                // ✅ بعدی خاص‌ها
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                NotImplementedException => StatusCodes.Status501NotImplemented,
                DbUpdateException => StatusCodes.Status500InternalServerError,
                
                // ✅ عام‌ترین‌ها آخر
                ArgumentException => StatusCodes.Status400BadRequest,
                InvalidOperationException => StatusCodes.Status400BadRequest,
                
                // ✅ بقیه خطاها
                _ => StatusCodes.Status500InternalServerError
            };

            // تنظیم پاسخ
            var response = new
            {
                success = false,
                message = GetUserFriendlyMessage(exception),
                statusCode = statusCode,
                detail = _env.IsDevelopment() ? new
                {
                    exception.Message,
                    exception.StackTrace,
                    exception.Source,
                    InnerException = exception.InnerException?.Message,
                    Data = exception.Data,
                    TargetSite = exception.TargetSite?.Name
                } : null,
                errorId = _env.IsProduction() ? Guid.NewGuid().ToString() : null,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            }));
        }

        /// <summary>
        /// پیام کاربرپسند برای خطاها
        /// </summary>
        private static string GetUserFriendlyMessage(Exception exception)
        {
            return exception switch
            {
                // ✅ خاص‌ترین‌ها اول
                ArgumentNullException => "یکی از پارامترهای ضروری خالی ارسال شده است.",
                FileNotFoundException => "فایل مورد نظر یافت نشد.",
                
                // ✅ خاص‌ها
                UnauthorizedAccessException => "شما دسترسی لازم برای این عملیات را ندارید.",
                KeyNotFoundException => "مورد درخواستی یافت نشد.",
                NotImplementedException => "این قابلیت هنوز پیاده‌سازی نشده است.",
                DbUpdateException => "خطا در ارتباط با دیتابیس رخ داده است. لطفاً مجدداً تلاش کنید.",
                
                // ✅ عام‌ها
                ArgumentException => "درخواست شما معتبر نیست. لطفاً اطلاعات را بررسی کنید.",
                InvalidOperationException => "عملیات مورد نظر امکان‌پذیر نیست.",
                
                // ✅ بقیه
                _ => "خطای داخلی سرور رخ داده است. لطفاً مجدداً تلاش کنید."
            };
        }
    }
}
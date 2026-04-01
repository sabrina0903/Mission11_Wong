using Microsoft.EntityFrameworkCore;
using Mission11_Wong.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();

// ✅ FIXED DB PATH
var isAzure = Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID") != null;

var dbPath = isAzure
    ? "/home/site/wwwroot/Bookstore.sqlite"   // Azure
    : Path.Combine(Directory.GetCurrentDirectory(), "Bookstore.sqlite"); // Local

builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}")
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowReact");

app.MapControllers();

// Ensure DB exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BookDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
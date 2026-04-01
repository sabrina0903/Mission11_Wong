using Microsoft.EntityFrameworkCore;
using Mission11_Wong.API.Data;

var builder = WebApplication.CreateBuilder(args);

//  Services
builder.Services.AddControllers();

builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

//  CORS MUST be here (before Build)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

//  Use CORS AFTER build
app.UseCors("AllowReact");

app.MapControllers();

app.Run();
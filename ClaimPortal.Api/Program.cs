using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Scalar.AspNetCore;
using ClaimPortal.Api.Data;
using ClaimPortal.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
        
    });
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SQLExpressConnection")));

builder.Services.AddScoped<ClaimService>();

builder.Services.AddAuthentication(Microsoft.Identity.Web.Constants.Bearer)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();



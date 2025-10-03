var builder = WebApplication.CreateBuilder(args);

// Leer origen permitido desde env (en local será http://localhost:5173)
var allowedOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN") ?? "http://localhost:5173";

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dexly", p => p
        .WithOrigins(allowedOrigin)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

app.UseCors("dexly");

// Endpoint de prueba
app.MapGet("/", () => "Hello Dexly API 👋");

app.Run();
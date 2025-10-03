using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// CORS
var allowedOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN") ?? "http://localhost:5173";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dexly", p => p
        .WithOrigins(allowedOrigin)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

// JWT
var issuer   = Environment.GetEnvironmentVariable("JWT_ISSUER")   ?? "dexly";
var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "dexly-client";
var keyStr   = Environment.GetEnvironmentVariable("JWT_KEY")      ?? "mesa-whitty-estopa-filtro-revestir-marco-lija";
var key      = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(o =>
  {
      o.TokenValidationParameters = new TokenValidationParameters {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = issuer,
          ValidAudience = audience,
          IssuerSigningKey = key,
          ClockSkew = TimeSpan.FromSeconds(30)
      };
  });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("dexly");
app.UseAuthentication();
app.UseAuthorization();

// Público
app.MapGet("/", () => "Hello Dexly API 👋");

// Login (demo)
app.MapPost("/auth/login", (LoginDto req) =>
{
    var u = Environment.GetEnvironmentVariable("LOGIN_USER") ?? "admin";
    var p = Environment.GetEnvironmentVariable("LOGIN_PASS") ?? "admin123";
    if (req.Username != u || req.Password != p) return Results.Unauthorized();

    var token = JwtHelpers.IssueJwt(req.Username, issuer, audience, key, TimeSpan.FromHours(8));
    return Results.Ok(new { token });
});

// Protegido
app.MapGet("/de/{key}", (string key) =>
{
    return Results.Json(new { Key = key, Rows = 12345, Protected = true });
})
.RequireAuthorization();

app.Run();

// ---- Tipos auxiliares (permitidos con top-level statements) ----
record LoginDto(string Username, string Password);

static class JwtHelpers
{
    public static string IssueJwt(string sub, string iss, string aud, SymmetricSecurityKey key, TimeSpan ttl)
    {
        var now = DateTime.UtcNow;
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: iss, audience: aud,
            claims: new[] { new System.Security.Claims.Claim("sub", sub) },
            notBefore: now, expires: now.Add(ttl), signingCredentials: creds
        );
        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
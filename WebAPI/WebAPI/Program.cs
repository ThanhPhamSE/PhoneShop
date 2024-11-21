
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Data;
using WebAPI.Repository.IRepository;
using WebAPI.Repository;
using WebAPI.Models;
using WebAPI.Services;
using static WebAPI.Repository.BrandRespository;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDBContext>(option =>
            {
                option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString"));
            });

            builder.Services.AddScoped<ITokenRepository, TokenRepository>();
            builder.Services.AddScoped<IHomeRepository, HomeRepository>();
            builder.Services.AddScoped<IProductDetailRepository, ProductDetailRepository>();
            builder.Services.AddScoped<IReviewRepository,ReviewRepository>();  
            builder.Services.AddScoped<IUserRepository ,UserRepository>();

            builder.Services.AddIdentityCore<User>()
            .AddRoles<Role>()
            .AddTokenProvider<DataProtectorTokenProvider<User>>("")
            .AddEntityFrameworkStores<AppDBContext>()
            .AddDefaultTokenProviders();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 0;
                options.Password.RequiredUniqueChars = 1;
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        AuthenticationType = "Jwt",
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });
            //Add Config for required email
            builder.Services.Configure<IdentityOptions>(
                options => options.SignIn.RequireConfirmedEmail = true);

            builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(10));

            //Add Email Configs
            var emailConfig = builder.Configuration.GetSection("EmailConfiguration")
                                           .Get<EmailConfiguration>();
            builder.Services.AddSingleton(emailConfig);

            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IProductManageRepository, ProductManagerRepository>();
            builder.Services.AddScoped<IBrandRepository, BrandRepository>();
            builder.Services.AddScoped<ICartRepository, CartRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}

using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace WitsmlExplorer.Api.Swagger;

public static class SwaggerGen
{
    public static void ConfigureSwaggerGen(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSwaggerGen(options =>
            {
                options.OperationFilter<WitsmlHeaderFilter>();

                var basicSecurityScheme = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "Basic",
                    Reference = new OpenApiReference { Id = "BasicAuth", Type = ReferenceType.SecurityScheme }
                };
                options.AddSecurityDefinition(basicSecurityScheme.Reference.Id, basicSecurityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {basicSecurityScheme, Array.Empty<string>()}
                });
                if (configuration["OAuth2Enabled"] == "True")
                {
                    var oAuth2scheme = new OpenApiSecurityScheme
                    {
                        In = ParameterLocation.Header,
                        Name = "Authorization",
                        Flows = new OpenApiOAuthFlows
                        {
                            AuthorizationCode = new OpenApiOAuthFlow
                            {
                                AuthorizationUrl = new Uri(configuration["AzureAd:Swagger:AuthorizationUrl"]),
                                TokenUrl = new Uri(configuration["AzureAd:Swagger:TokenUrl"])
                            }
                        },
                        Type = SecuritySchemeType.OAuth2
                    };
                    options.AddSecurityDefinition("OAuth2", oAuth2scheme);
                    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference { Id = "OAuth2", Type = ReferenceType.SecurityScheme },
                                Type = SecuritySchemeType.OAuth2,
                            },
                            new List<string> { }
                        }
                    });
                }
            }
        );
    }

    public static void ConfigureSwagger(this IApplicationBuilder app, IConfiguration configuration)
    {
        app.UseSwagger();
        if (configuration["OAuth2Enabled"] == "True")
        {
            app.UseSwaggerUI(
                options =>
                {
                    options.OAuthAppName(configuration["AzureAd:AppName"]);
                    options.OAuthClientId(configuration["AzureAd:ClientId"]);
                    options.OAuthScopes(configuration["AzureAd:Scopes"]);
                    options.OAuthUsePkce();
                }
            );
        }
        else
        {
            app.UseSwaggerUI();
        }
    }
}
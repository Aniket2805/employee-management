package com.backend.security_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                // ✅ Add server URL (either https or relative)
                .addServersItem(new Server().url("/"))  // Automatically uses https in production
                // .addServersItem(new Server().url("https://hr-service.up.railway.app")) // Optional explicit version
                .info(new Info()
                        .title("Security Service API")
                        .description("Documentation for the Security Service with JWT authentication")
                        .version("1.0.0"));
    }
}

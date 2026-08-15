package com.smartqueue.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI smartQueueOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartQueue API")
                        .description("QR-Based Virtual Queue Management System - REST API documentation")
                        .version("v1.0.0")
                        .contact(new Contact().name("SmartQueue Team").email("support@smartqueue.com")));
    }
}

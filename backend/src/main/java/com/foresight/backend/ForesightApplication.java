package com.foresight.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ForesightApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForesightApplication.class, args);
    }

}

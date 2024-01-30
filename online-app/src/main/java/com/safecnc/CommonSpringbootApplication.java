package com.safecnc;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.context.annotation.Import;

import com.safecnc.comm.conf.WebApplicationInitializer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication(exclude = {ThymeleafAutoConfiguration.class})
@Import({WebApplicationInitializer.class})
public class CommonSpringbootApplication {
	/*
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		
		application.bannerMode(Banner.Mode.OFF);
		application.logStartupInfo(false);
		
        return application.sources(Sfd2022SpringbootApplication.class);
    }
	*/
	public static void main(String[] args) {
		
		log.debug("@@@@@ SafeCnc SpringBootApplication start @@@@@");

		SpringApplication springApplication = new SpringApplication(CommonSpringbootApplication.class);
		springApplication.setBannerMode(Banner.Mode.OFF);
		springApplication.setLogStartupInfo(false);
		springApplication.run(args);
		
		log.debug("@@@@@ SafeCnc SpringBootApplication end @@@@@");
	}

}
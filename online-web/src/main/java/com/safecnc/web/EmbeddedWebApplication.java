package com.safecnc.web;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import com.safecnc.CommonSpringbootApplication;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@SpringBootApplication
public class EmbeddedWebApplication extends SpringBootServletInitializer {

	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		
		//log.debug("@@@@@ Dong-in Online Web AppApplication start updated test @@@@@");
		
		application.bannerMode(Banner.Mode.OFF);
		application.logStartupInfo(false);
		
        return application.sources(CommonSpringbootApplication.class);
    }
	
	public static void main(String[] args) {

		log.debug("@@@@@ Safecnc Online Web AppApplication start @@@@@");
		
		SpringApplication springApplication = new SpringApplication(CommonSpringbootApplication.class);
		springApplication.setBannerMode(Banner.Mode.OFF);
		springApplication.setLogStartupInfo(false);
		springApplication.run(args);
	}

}
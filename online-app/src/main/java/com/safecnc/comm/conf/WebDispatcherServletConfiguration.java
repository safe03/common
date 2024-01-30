package com.safecnc.comm.conf;

import javax.annotation.Resource;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.safecnc.annotation.EnableNexacro;

import lombok.extern.slf4j.Slf4j;

/**
 * 서블릿(프론트)과 관련된 설정파일을 등록한다.</br>
 * 
 * @author jhlee
 * @since 2022-02-13
 */
@Slf4j
@Configuration
@EnableNexacro
public class WebDispatcherServletConfiguration implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		log.debug("@@@@@ addResourceHandlers start @@@@@");

		// open api swagger resources
		registry.addResourceHandler("/swagger-ui/**").addResourceLocations("/swagger-ui/");

		// nexacro ui resources
		registry.addResourceHandler("/comUi/**").addResourceLocations("/comUi/");

		// web application resources
		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");

		// nexacro excel export url
		registry.addResourceHandler("/export/**").addResourceLocations("/export/");

		// nexacro excel import url
		registry.addResourceHandler("/import/**").addResourceLocations("/import/");
		
		// ubi report url
		registry.addResourceHandler("/ubi4/**").addResourceLocations("/ubi4/");
		
		log.debug("@@@@@ addResourceHandlers end @@@@@");
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		log.debug("@@@@@ addInterceptors start @@@@@");

		log.debug("@@@@@ addInterceptors end @@@@@");
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {

		log.debug("@@@@@ addViewControllers start @@@@@");
		
		// 루트(/)와 /ui의 경우 넥사크로 요청으로 처리
		registry.addRedirectViewController("/", "/comUi/");
		registry.addRedirectViewController("/comUi", "/comUi/index.jsp");
		registry.addRedirectViewController("/comUi/", "/comUi/index.jsp");
		
		// /ui/는 welcome page로 이동
		registry.addViewController("/comUi/").setViewName("/comUi/index.jsp");
		
		log.debug("@@@@@ addViewControllers etart @@@@@");
	}

	@Override
	public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
		
        configurer.setTaskExecutor(asyncTaskExecutor);
	}
	
	@Resource(name = "asyncTaskExecutor")
	private AsyncTaskExecutor asyncTaskExecutor;
}

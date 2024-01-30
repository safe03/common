package com.safecnc.comm.conf;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.safecnc.CommonSpringbootApplication;

import com.safecnc.comm.filt.UserSessionPersistenceFilter;

import lombok.extern.slf4j.Slf4j;

/**
 * 공통 영역에 적용 되는 컴포넌트와 해당 컴포넌트가 기본적으로 사용할 함수들을 등록한다. </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see AntPathMatcher
 * @see CommonsMultipartResolver
 */
@Slf4j
@Configuration
@ComponentScan(basePackageClasses = CommonSpringbootApplication.class, includeFilters = {
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Service.class),
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Repository.class)
	}, excludeFilters = {
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Controller.class),
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Configuration.class)
	})
public class ApplicationConstConfiguration {

	/**
	 * 앤트(ant) 스타일의 경로를 매칭하는 인스턴스를 반환한다.
	 * 
	 * @return AntPathMatcher 등록.  Ant 경로 패턴 경로와 일치하는지 여부를 확인
	 */
	@Bean
	public AntPathMatcher antPathMatcher() {
		
		return new AntPathMatcher();
	}
	
	/**
	 * 서버에서 사용할 앱 기본 메시지 소스
	 * 
	 * @return [Resource 설정] 메세지 Properties 경로 설정
	 */
	@Bean("messageSource")
	public ReloadableResourceBundleMessageSource messageSource() {
		
		ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource = new ReloadableResourceBundleMessageSource();
		
		reloadableResourceBundleMessageSource.setBasenames("classpath:/safecnc/message/message-common");
		
		reloadableResourceBundleMessageSource.setDefaultEncoding("UTF-8");
		
		reloadableResourceBundleMessageSource.setFallbackToSystemLocale(false);
		
		reloadableResourceBundleMessageSource.setCacheSeconds(60);
		
		return reloadableResourceBundleMessageSource;
	}

	
	/**
	 * @return [MultipartResolver 설정] CommonsMultipartResolver 등록
	 */
	@Bean
	public CommonsMultipartResolver commonsMultipartResolver() {
		
		CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
		
		commonsMultipartResolver.setMaxUploadSize(100000000);
		
		commonsMultipartResolver.setMaxInMemorySize(100000000);
		
		return commonsMultipartResolver;
	}
	
	@Profile("local")
	@Bean
	public String activeProfileLocal() {

		log.info("@local profile activation@");
		
		UserSessionPersistenceFilter.activeProfile = "local";
		
		return "local";
	}
	
	@Profile("test")
	@Bean
	public String activeProfileTest() {
		
		log.info("@test profile activation@");
		
		UserSessionPersistenceFilter.activeProfile = "test";
		
		return "test";
	}
	
	@Profile("stage")
	@Bean
	public String activeProfileStage() {
		
		log.info("@stage profile activation@");
		
		UserSessionPersistenceFilter.activeProfile = "stage";
		
		return "stage";
	}
	
	@Profile("prod")
	@Bean
	public String activeProfileProduct() {
		
		log.info("@product profile activation@");

		UserSessionPersistenceFilter.activeProfile = "prod";
		
		return "prod";
	}
	
}

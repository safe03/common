package com.safecnc.comm.conf;

import java.net.Inet4Address;
import java.net.UnknownHostException;

import org.springdoc.core.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.safecnc.comm.conf.ApplicationOpanAPiConfiguration.GroupsConfiguration;

import io.swagger.v3.core.filter.AbstractSpecFilter;
import io.swagger.v3.core.filter.SpecFilter;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import lombok.extern.slf4j.Slf4j;

/**
 * 스프링 부트의 open-api with swagger를 처리하기 위한 설정 클래스 </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see OpenAPI
 * @see Info
 * @see ExternalDocumentation
 * @see GroupsConfiguration
 * @see GroupedOpenApi
 */
@Slf4j
@Import({
	GroupsConfiguration.class
})
public class ApplicationOpanAPiConfiguration {

	@Configuration
	public class GroupsConfiguration {
		
		@Bean
		public GroupedOpenApi commonGroup() {
			
	    	return GroupedOpenApi.builder()
	    						.group("1. 시스템 관리(on package "+baseUrl+".comm)")
	    						.packagesToScan(baseUrl+".comm")
	    						.pathsToExclude("/api/*")
	    						.build();
		}
		
		@Bean
		public GroupedOpenApi nexacroGroup() {
			
			return GroupedOpenApi.builder()
								.group("2. 넥사크로(모듈별로 작업 예정 at the end 'nx')")
								.packagesToScan(baseUrl)
								.packagesToExclude(baseUrl+".comm")
								.pathsToMatch("/**/*.nx")
								.build();
		}
		
	    @Bean
	    public GroupedOpenApi applicationInterfaceGroup() {
	    	
	    	return GroupedOpenApi.builder()
	    						.group("3. Application Programming Interface(start with 'api')")
	    						.pathsToMatch("/api/*")
	    						.build();
	    }
	}
	
	/**
	 * <desc>
	 * Open Api 객체를 설정하여 결과 객체를 반환한다.
	 * </desc>
	 * 
	 * @return Open Open Api 객체를 반환한다.
	 */
    @Bean
    public OpenAPI api() { 
    	OpenAPI openAPI = new OpenAPI();
    	
    	openAPI.info(openApiInfo());
    	
    	openAPI.externalDocs(openApiExternalDocs());
    	
    	openAPI.components(new Components());

    	//openAPI.addServersItem(openApiServer());
    	
		new SpecFilter().filter(openAPI, new AbstractSpecFilter() { }, null, null, null);
    	
    	return openAPI;
    }

	/**
     * <desc>
     * open api 서버셋을 반환한다.
     * </desc>
     * @return Server swagger(OpenApi) information
     */
    private Server openApiServer()
    {
    	Server server = new Server();
    	
		try {
			server.setUrl(Inet4Address.getLocalHost().getCanonicalHostName());
		} catch (UnknownHostException e) {
			server.setUrl("로컬 테스트");
		}
		
		return server;
    }
    
    
	/**
     * <desc>
     * open api 정보셋을 반환한다.
     * </desc>
     * @return Info swagger(OpenApi) information
     */
    private Info openApiInfo() {
    	
    	Info info       = new Info();
    	Contact contact = new Contact();
    	License license = new License();
    	
    	info.termsOfService(termsOfService)
	    		.title(title)
	    		.description(description)
	    		.version(version);
    	
    	contact.email(contactEmail)
	    		.name(contactName)
	    		.url(contactUrl);
    	
    	license.name(licenseName)
    			.url(licenseUrl);
    	
    	info.contact(contact);
    	info.license(license);
    	
    	return info;
    }
    
    /**
     * 
     * @return
     */
    private ExternalDocumentation openApiExternalDocs() {
    	
    	ExternalDocumentation externalDocumentation = new ExternalDocumentation();
    	
    	externalDocumentation.description(externalDocumentationDescription)
    							.url(externalDocumentationUrl);
    	
    	return externalDocumentation;
    }
    
    /* 기준 경로 */
	@Value("${openapi.base}")
	private String baseUrl;
	
    /** 서비스 목차 */
    @Value("${openapi.terms-of-service:}")
    public String termsOfService;
    
    /* 애플리케이션 목차 */
    @Value("${openapi.title:}") 
    public String title;
    
    /* 애플리케이션 내용 */
    @Value("${openapi.description:}") 
    public String description;
    
    /* 애플리케이션 버전 */
    @Value("${openapi.version:}") 
    public String version;
    
    /* 담당자 이메일 */
    @Value("${openapi.contact.email:}") 
    public String contactEmail;
    
    /* 담당자 명 */
    @Value("${openapi.contact.name:}") 
    public String contactName;
    
    /* 담당자 관리 페이지 */
    @Value("${openapi.contact.url:}") 
    public String contactUrl;
    
    /* 라이선스 타입 명 ESB, apache tomcat */
    @Value("${openapi.license.name:1.0.1}") 
    public String licenseName;
    
    /* 라이선스 관리 페이지 */ 
    @Value("${openapi.license.url:./}") 
    public String licenseUrl;
    
    /* 추가 상세 내용 */
    @Value("${openapi.externalDocumentation.description:}") 
    public String externalDocumentationDescription;
    
    /* 추가 페이지 */
    @Value("${openapi.externalDocumentation.url:}") 
    public String externalDocumentationUrl;
}

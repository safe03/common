package com.safecnc.comm.conf;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * @author jhlee
 * @since 2022-02-13
 * @deprecated 스프링 부트의 통합 이니셜라이져로 처리
 */
@Deprecated
public class WebApplicationInitializer{
//public class Sfd2022WebApplicationInitializer implements WebApplicationInitializer {

	/** mappings */
	public final String[] SERVER_MAPPING_URLS = { "/*" };
	
	@Deprecated
	public void onStartup(ServletContext servletContext) throws ServletException {
		
		// 루트 컨텍스트 등록
		addRootContext(servletContext);

		// 서블릿 컨텍스트 등록
		addWebServletContext(servletContext);

		// 서블릿 이벤트 리스너 등록
		servletContext.addListener(new WebServletContextListener());

		// 필터 등록
		addFilters(servletContext);
	}

	/**
	 * @param servletContext
	 * Root Context를 등록한다.
	 */
	@Deprecated
	private void addRootContext(ServletContext servletContext) {
		
		// 루트 컨텍스트 생성
		AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
		
		// 루트 컨텍스트에 설정 파일 추가
		rootContext.register(ApplicationConfiguration.class);
		
		// 서블릿 컨텍스트에 이벤트 추가
		servletContext.addListener(new ContextLoaderListener(rootContext));
	}

	/**
	 * Servlet Context를 등록한다.
	 * @param servletContext
	 */
	@Deprecated
	private void addWebServletContext(ServletContext servletContext) {
		
		// 어노테이션 컨텍스트 생성
		AnnotationConfigWebApplicationContext webApplicationContext = new AnnotationConfigWebApplicationContext();
		
		// 웹 컨텍스트의 디스패치(프론트) 컨트롤러 추가
		webApplicationContext.register(WebDispatcherServletConfiguration.class);

		// 디스패치 서블릿을 프론트로 등록
		ServletRegistration.Dynamic dispatcher = servletContext.addServlet("nexacro", new DispatcherServlet(webApplicationContext));

		// 순서를 최상위로 이동
		dispatcher.setLoadOnStartup(1);

		// 프론트 컨트롤러와 URL을 매핑
		dispatcher.addMapping(SERVER_MAPPING_URLS);
	}

	/**
	 * 필터들을 등록 한다.
	 * @param servletContext
	 */
	@Deprecated
	private void addFilters(ServletContext servletContext) {
		
		// 인코딩 필터 등록
		addEncodingFilter(servletContext);
	}

	/**
	 * Spring CharacterEncodingFilter 설정
	 * @param servletContext
	 */
	@Deprecated
	private void addEncodingFilter(ServletContext servletContext) {
		
		// 인코딩 핉터 생성
		FilterRegistration.Dynamic characterEncoding = servletContext.addFilter("encodingFilter",new CharacterEncodingFilter());
		
		// 필터 인코딩 등록
		characterEncoding.setInitParameter("encoding", "UTF-8");
		
		// 강제 인코딩 등록
		characterEncoding.setInitParameter("forceEncoding", "true");
		
		// 인코딩 주소 지정
		characterEncoding.addMappingForUrlPatterns(null, false, SERVER_MAPPING_URLS);
	}

}

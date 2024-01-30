package com.safecnc.comm.conf;

import org.apache.catalina.Context;
import org.apache.catalina.webresources.StandardRoot;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
/**
 * 웹 서버와 관련 된 처리 빈을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-06-22
 * @see Configuration
 * @see ServletWebServerFactory
 */
//@EnableSpringHttpSession
public class ApplicationWebConfiguration {
	
//    @Bean
//    public MapSessionRepository sessionRepository() {
//    	MapSessionRepository mapSessionRepository = new MapSessionRepository(new ConcurrentHashMap());
//        return mapSessionRepository;
//    }
	
	@Bean
	public ServletWebServerFactory servletContainer() {
		
		ServletWebServerFactory tomcatFactory = new TomcatServletWebServerFactory() {
			
	        @Override
	        protected void postProcessContext(Context context) {
	            final int cacheSize = 40 * 1024;
	            StandardRoot standardRoot = new StandardRoot(context);
	            standardRoot.setCacheMaxSize(cacheSize);
	            context.setResources(standardRoot); // This is what made it work in my case.

	            logger.info(String.format("New cache size (KB): %d", context.getResources().getCacheMaxSize()));
	        }
	    };
	    
	    return tomcatFactory;
	}
}


package com.safecnc.comm.conf;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import lombok.extern.slf4j.Slf4j;
/**
 * 서블릿 컨테이너를 시작할때 발생하는 이벤트를 처리한다. </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see ServletContextListener
 */
@Slf4j
public class WebServletContextListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent event) { 
		
		log.debug("@@@@@ ServletContextListener Context Initialized @@@@@");
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		
		log.debug("@@@@@ ServletContextListener Context Destroyed @@@@@");
	}
}

package com.safecnc.comm.dimn;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;

public class WebMailDestributerFactory implements FactoryBean<WebMailDestributer>{

	@Autowired
	public JavaMailSender javaMailSender;
	
	@Override
	public WebMailDestributer getObject() throws Exception {
		
		return new WebMailDestributer(javaMailSender);
	}
	
	@Override
	public Class<?> getObjectType() {
		return WebMailDestributer.class;
	}
	
}

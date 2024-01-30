package com.safecnc.comm.util;

import java.util.Iterator;
import java.util.Map;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

public class ThymeleafUtils {
	
	private static SpringTemplateEngine templateEngine;
	
	static {
		templateEngine = new SpringTemplateEngine();
		
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		
        templateResolver.setPrefix("/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML");
        templateResolver.setForceTemplateMode(true);

        templateEngine.setTemplateResolver(templateResolver);
	}
	
	/**
	 * Thymeleaf를 사용하여 html 정보를 랜더링 한다.
	 * @param view 뷰 정보
	 * @param model 모델 정보
	 * @return
	 */
	public static String html(String view, Map<String,Object> model) {

		final Context ctx = new Context();
		
		// setting model
		Iterator<String> items =  model.keySet().iterator();
		
		String item;
		while (items.hasNext()) {
			
			item = items.next();
			
			ctx.setVariable(item, model.get(item));
		}
		
		// so that we can reference it from HTML
		try {
			
			return templateEngine.process(view, ctx);
		}
		catch(Exception e) 
		{
			throw e;
		}
	}
}

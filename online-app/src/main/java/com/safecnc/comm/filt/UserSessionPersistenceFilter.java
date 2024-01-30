package com.safecnc.comm.filt;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.AntPathMatcher;

import com.safecnc.comm.auth.AuthenticationPrinciple;
import com.safecnc.comm.auth.AuthorizationHolder;
import com.safecnc.web.handler.AbstractController;

/*******************************************************************
<h1>NAME : </h1>
<p>세션 지속성 관리를 위한 Web Filter Class</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
</pre>
********************************************************************/

//@WebFilter(filterName = "UserSessionPersistenceFilter", urlPatterns = {"/*"}, asyncSupported = true)
//@PropertySource("classpath:application.properties")
public class UserSessionPersistenceFilter implements Filter{

	/* 로그인 페이지는 권한 인증을 제외 */
	private String[] loginPages = { 
		  "/**/ComLogin_Login.nx" // PC 폼 로그인 페이지
		, "/ssologincheck.do"     // 모바일 SSO 페이지 
	}; 
	
	/* 리소스 또는 권한 인증을 제외할 페이지 */
	private String[] ignorePagesDev = {
		  "/"                    // 웹 사이트 최초 진입점 (PC 사이트로 이동해야 하므로 제외)
		, "/comUi/**"               // 넥사크로 리소스 파일
		, "/views/**"            // jsp view 경로
		, "/resources/**"        // web resource 경로
		, "/api/**"              // open api 경로 (* 필요 시 제거)
		, "/swagger-ui/**"       // open api spec 경로 (* 필요 시 제거)
		, "/v3/**"               // open api spec 경로 (v2) (* 필요 시 제거)
		, "/v2/**"               // open api spec 경로 (v3) (* 필요 시 제거)
		, "/**/*.ws"             // websocket 경로 (* 추후 제거)
		, "/mobile/**"           // mobile conntect 경로 (* 추후 제거)
		, "/eai/**"              // open api eai 경로 (* 추후 제거)
		, "/comn/**"             // 공통 처리를 위한 함수 경로 (* 추후 제거)
	}; 
	
	/* 리소스 또는 권한 인증을 제외할 페이지 운영 반영 */
	private String[] ignorePagesProd = {
		  "/"                    // 웹 사이트 최초 진입점 (PC 사이트로 이동해야 하므로 제외)
		, "/comUi/**"               // 넥사크로 리소스 파일 (모바일의 경우 SSO인증으로만 들어 올수 있도록 되어 있다.)
		, "/views/**"            // jsp view 경로
		, "/resources/**"        // web resource 경로
		, "/api/**"              // open api 경로 (* 필요 시 제거)
	}; 
	
	/* 경로 매핑을 위하여 AntMatcher를 생성 */
	private AntPathMatcher antPathMatcher = new AntPathMatcher();
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
    	
    	// 프로파일에 따른 인가 분기 처리
    	String[] ignoreCaseList;
    	
    	if(activeProfile.toUpperCase().equals("PROD"))
    	{
    		ignoreCaseList = ignorePagesProd;
    	}
    	else
    	{
    		ignoreCaseList = ignorePagesDev;
    	}
    	 
    	
    	HttpServletRequest  httpServletRequest  = (HttpServletRequest)  request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        String str_contextPath = httpServletRequest.getContextPath();
        
        String requestUri = httpServletRequest.getRequestURI();
        
        // 로그인 페이지는 예외
        if(!Objects.isNull(loginPages)) {

			for(String loginPage : loginPages) {
				
				if(antPathMatcher.match(str_contextPath+loginPage, requestUri)) { 
					
					filterChain.doFilter(request, response);
					
					return;
				}
			}
        }

        // 인증 제외 페이지는 예외
        if(!Objects.isNull(ignoreCaseList)) {

			for(String ignorePage : ignoreCaseList) {
				
				if(antPathMatcher.match(str_contextPath+ignorePage, requestUri)) { 
					
					filterChain.doFilter(request, response);
					
					return;
				}
			}
        }
		
		// 그 외의 경우 인증을 통과 하여야만 애플리케이션으로 들어올 수 있도록 처리
        AuthenticationPrinciple<Map<String,Object>> IdentifiedById = AuthorizationHolder.getAuthenticationPrinciple(httpServletRequest);
		
		// 세션에 등록 된 값이 없을 경우 즉시 반환
		if(Objects.isNull(IdentifiedById)) {
			
	    	if(activeProfile.toUpperCase().equals("PROD"))
	    	{
	    		returnErrorMessage(httpServletRequest, httpServletResponse, "");
	    	}
	    	else
	    	{
	    		//returnErrorMessage(httpServletRequest, httpServletResponse, "");
	    		filterChain.doFilter(request, response);
	    	}
			
			return;
		}
		
        filterChain.doFilter(request, response);
    }

    /**
     * 넥사크로 화면에서 was를 접근하려면 transaction api 를 사용하는데, 해당 api의 onerror 에 값을 셋팅하려면 넥사크로 xml 양식에 맞춰서 리턴해야 한다.
     **/
    public void returnErrorMessage(HttpServletRequest request, HttpServletResponse response, String errorMsg) throws IOException {
    	
        if (isNexacroRequest(request)) {
            /*
                XML 밸류를 작은 따옴표로 묶으면 넥사크로엔진에서 인식 못함. \" 으로 묶는다.
                오류 메세지에 큰따옴표를 넣지 않는다.
            */
            String sReturnXML =   "<?xml version=\"1.0\" encoding=\"UTF-8\"?> "
                                + "<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\"> "
                                + " <Parameters> "
                                + "     <Parameter id=\"ErrorCode\" type=\"string\">"   + -1 + "</Parameter> "
                                + "     <Parameter id=\"ErrorMsg\" type=\"string\">"    + AbstractController.getMessage(-1, 501, errorMsg) + "</Parameter>"
                                + " </Parameters> "
                                + "</Root> ";

            /*  예전 code404.jsp에 있던 로직.
                response.reset();
                response.setContentType("application/xml;charset=UTF-8");
            */

            response.setCharacterEncoding("UTF-8");
            try {
                response.getWriter().write(sReturnXML);
                response.getWriter().flush();
            } catch (IOException e) {
                //오류발생시 처리 안함.
                response.reset();
            }
        } else {
        	
        	response.sendRedirect(request.getContextPath()+"/");
        	response.flushBuffer();
        }

        return;
    }
    

    /*******************************************************************
    * NAME : HTTP Request 가 Nexacro HTTP Request 요청인지 확인한다.
    * DESC : Nexacro 요청인 경우 true, 아니면 false를 반환한다.
    ********************************************************************/
    private boolean isNexacroRequest(HttpServletRequest request) {
    	
    	String pPlatform = request.getHeader("platform");
    	
    	// 헤더에 속성이 없을 경우 즉지 반환
    	if(Objects.isNull(pPlatform)) {
    			
    		return false;
    	}
    	
    	return "NEXACRO".equals(pPlatform.toUpperCase());
    }

	@Override
    public void init(FilterConfig filterConfig) throws ServletException { }

    @Override
    public void destroy() { }
    
    
    /** 설정 프로파일에 따른 분기 처리를 위한 변수 */
	public static String activeProfile;
}

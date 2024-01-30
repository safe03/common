<%@page import="org.springframework.security.core.authority.SimpleGrantedAuthority"%>
<%@page import="java.util.Iterator"%>
<%@page import="org.springframework.security.core.GrantedAuthority"%>
<%@page import="java.util.Collection"%>
<%@page import="java.util.stream.Collector"%>
<%@page import="org.springframework.security.core.Authentication"%>
<%@page import="org.springframework.security.core.context.SecurityContext"%>
<%@page import="java.util.Objects"%>
<%@page import="org.springframework.security.core.context.SecurityContextHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html > <!-- LANGUAGE : locale setting (value of location property in Environment) -->
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="user-scalable=1, initial-scale=0.1, width=device-width, target-densitydpi=device-dpi">
	<!-- META_CHECKVERSION : Add if value of checkversion property in Envrionment is true -->

	
	<!-- FAVICON_ICON : favion setting (value of icon property in Environment. add to value of icon property in Environment) -->
    <link rel="shortcut icon" href="./favicon.ico">
	
	<!-- USERFONT_STYLE : userfont style setting (value of userfontid property in Environment. crate contents contained in xfont file specified userfontid property in Environment) -->

	
	
	<%-- 넥사크로 스크립트 --%>
	<%@ include file="./includes/nexacro.jsp" %>

    <%-- 외부 스크립트 --%>
    <%@ include file="./includes/external.jsp" %>
        
    <style>
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px transparent inset ; -webkit-text-fill-color: #000; }
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { transition: background-color 5000s ease-in-out 0s; }

		@font-face {
			font-family: 'GmarketSansMedium';
			src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
			font-weight: 100;
			font-style: normal;
		}

		.fSmall ,.Static.aTag ,.fxSmall *{
			font-size: 10px !important;
		}

		.btnLogin *{
			font-weight: 700 !important;
		}

		.Button.btnLogin {
			letter-spacing: 2px;
			font-weight: bold !important;
			font-size: 28px !important;
			padding-top: 2px;
		}
		
		body * {
			font-family: 'GmarketSansMedium' !important;
		}
    </style>
	
	<title>safecnc</title>
</head>
<body style="margin:0;border:none;-ms-touch-action:none;" onload="oninitframework()">


	<script>
		
		<%
			boolean isRememberMe = false;
			String requestUrlToMapping = "";

			// 권한 인증으로 들어오는 사용자의 경우 즉시 로그인 하도록 remember me 기능을 jsp로 추가
			SecurityContext SecurityContext = SecurityContextHolder.getContext();
			
			// 스프링 시큐리티를 사용하는 컨텍스의 경우 해당 처리
			if(!Objects.isNull(SecurityContext))
			{
				Authentication authenticatedAuthentication = SecurityContext.getAuthentication();

				// 이미 세션으로 인증된 사용자에게는 즉시 인증 정보를 반환하여 준다.
				if(!Objects.isNull(authenticatedAuthentication) && authenticatedAuthentication.isAuthenticated() ){
					
					Collection<?> grantedAuth = authenticatedAuthentication.getAuthorities();

					Iterator<?> it = grantedAuth.iterator();

					// 사용자 권한이 있을 경우 rememberme로 처리
					while(it.hasNext()){
						
						SimpleGrantedAuthority grantedAuthority = (SimpleGrantedAuthority)it.next();

						if("USER".equals(grantedAuthority.getAuthority())){
							isRememberMe = true;
							break;
						}
					}
				}
			}
		%>

		function oninitframework()
		{
            nexacro.setInitialVariable("application", "GBL_CONTEXT_PATH", "<%= request.getContextPath() %>");
            nexacro.setInitialVariable("application", "GBL_REMEMBER", <%= isRememberMe %>);
            nexacro.setInitialVariable("application", "GBL_SERVER_NAME", "<%= request.getServerName() %>");
            
			<!-- SCREEN_INFORMATION : create screen information defined in Environment > ScreenDefinition -->
			var screeninfo = [
            	{"id":"Desktop_screen","type":"desktop","networksecurelevel":"all","themeid":"theme::common","xadl":"Application_Desktop.xadl.js"}
			];
			nexacro._initHTMLSysEvent(window, document);
			nexacro._initEnvironment(screeninfo);
			<!-- create internal iframe -->
			<!-- USERFONT_INFORMATION : userfontid property is specified in the Environment -->
			nexacro._prepareManagerFrame(onloadframework);
		}
		function onloadframework()
		{
			<!-- application loading -->
			nexacro._loadADL();
		}
		function onfinalframework()
		{
			<!-- application exit -->
		}
	</script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js" integrity="sha512-iKDtgDyTHjAitUDdLljGhenhPwrbBfqTKWO1mkhSFH3A7blITC9MhYon6SjnMhp4o0rADGw9yAC6EW4t5a4K3g==" crossorigin="anonymous"></script>
</body>
</html>
  
  

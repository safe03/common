package com.safecnc.comm.conf;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.expression.SecurityExpressionHandler;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import com.safecnc.comm.scrt.NexacroAuthenticationEntrypoint;
import com.safecnc.comm.scrt.NexacroAuthenticationFailureHandler;
import com.safecnc.comm.scrt.NexacroAuthenticationFilter;
import com.safecnc.comm.scrt.NexacroAuthenticationProvider;
import com.safecnc.comm.scrt.NexacroAuthenticationSuccessHandler;
import com.safecnc.comm.scrt.NexacroPasswordEncoder;
import com.safecnc.comm.scrt.NexacroUnAuthenticationSuccessHandler;
import com.safecnc.comm.scrt.NexacroUserDetailService;
import com.safecnc.comm.scrt.SessionControlManagementStorage;


/**
 * 웹 보안과 관련 된 처리 빈을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-06-13
 * @see Configuration
 * @see WebSecurityConfigurerAdapter
 * @see UsernamePasswordAuthenticationFilter
 * @see NexacroAuthenticationSuccessHandler
 * @see NexacroAuthenticationFailureHandler
 * @see NexacroAuthenticationFilter
 * @see PasswordEncoder
 * @see NexacroPasswordEncoder
 * @see NexacroUserDetailService
 * @see NexacroAuthenticationProvider
 */
/**
 *   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
      +     Spring Security 란?
	       
	  +    Spring Security는 스프링 기반의 어플리케이션 보안을 담당하는 프레임워크이다.
	
	  +    Spring Security를 사용하면 사용자 인증, 권한, 보안처리를 간단하지만 강력하게 구현 할 수 있다. 
	
	  +    Filter 기반으로 동작하기 때문에 Spring MVC와 분리되어 동작한다. 
	
	  +    Spring Security를 이해하기 위해서는 먼저 보안관련 용어를 숙지해야 한다.
	
	   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	   
 * @author safe03
 *    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *    +  #########   Spring Security 동작   
 *    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     
     + #  iptables.properties  :  set
     
     1. AuthenticationFilter (UsernamePasswordAuthenticationFilter)는 사용자의 요청을 가로챈다. 
 
        그리고 인증이 필요한 요청이라면 사용자의 JSESSIONID가 Security Context에 있는지 판단한다. 없으면 로그인 페이지로 이동시킨다
	
	    로그인 페이지에서 요청이 온 경우라면 로그인 페이지에서 입력받은 username과 password를 이용해 UsernamePasswordAuthenticationToken을 만든다.  
	    
	    그리고 UsernamePasswordAuthenticationToken 정보가 유효한 계정인지 판단하기 위해 AuthenticationManager로 전달한다.
	
	
	2. AuthenticationManager 인터페이스의 구현체는 ProviderManger이고  AuthencationProvider에게 비밀번호 인증 로직 책임을 넘긴다. 
	   
	    (AuthencationProvider는 개발자가 직접 커스텀해서 비밀번호 인증로직을 직접 구현할 수 있다.)
	
	3. AuthencationProvider는 UserDetailsService를 실행해 비밀번호 인증 로직을 처리한다.
	
	    UserDetailsService는 DB에 저장된 회원의 비밀번호와 비교해 일치하면 UserDetails 인터페이스를 구현한 객체를 반환하는데, 
	    
	    UserDetailsService는 인터페이스이며 UserDetailsService를 구현한 서비스를 직접 개발해야한다. 
	    
	     ( com.safecnc.comm.scrt.NexacroUserDetailService )
	
	4. 인증 로직이 완료되면 AuthenticationManager는 Authentication를 반환하며, 
	
	     결과적으로 SecurityContext에 사용자 인증 정보가 저장된다.
	
	5. 인증 과정이 끝났으면 AuthenticationFilter에게 인증에 대한 성공 유무를 전달하고
	    
	    성공하면 AuthenticationSuccessHandler를 호출하고 
	    
	    실패하면 AuthenticationFailureHandler를 호출한다.
	    
 */
@EnableWebSecurity
public class ApplicationWebSecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		
		auth.authenticationProvider(nexacroAuthenticationProvider());
	}
	
    @Override
    public void configure(WebSecurity web) {
    	
        web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
    
	@Override
	protected void configure(HttpSecurity http) throws Exception {

		// 인증 권한 설정
        http
        	// 모든 요청에 관한 인증 처리를 요구
        	.authorizeRequests() 
		        // 리소스를 사용하기 위한 권한 오픈
		        .antMatchers(ignoreUrls).permitAll()
	        // 그 외의 접근은
	        .anyRequest()
		        // 인증을 통한 접근으로만 가능
		        .authenticated()
        	.and()
        	// X-FRAME 옵션을 제거한 다음
        	.headers()
        		.frameOptions().disable()
        			// 동일 사이트만 가능하도록 처리 on X-FRAME-OPTIONS: sameOrigin
        			.addHeaderWriter(new StaticHeadersWriter("X-FRAME-OPTIONS", "sameOrigin")) 
        		.and()
			        // _csrf 토큰을 제거하고
			        .csrf().disable() 
			        // cors 접근을 제거
			        .cors().disable() 
	        // 로그아웃을 처리
	        .logout()
	        		.logoutUrl(logoutProcessUrl).permitAll()
	        		.logoutSuccessHandler(sfd2022NexacroUnAuthenticationSuccessHandler())
	        .and()
	        	// 오류 처리를 위한 엔트리 포인트 생성
	        	.exceptionHandling().authenticationEntryPoint(nexacroAuthenticationEntrypoint())
	        .and()
	        	// 로그인 처리를 위한 엔트리 필터를 생성하여 기본 인증기 앞에 추가
	        	.addFilterBefore(nexacroAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        	;
        
        //  필터로 대체
		//        // 화면 로그인을 사용하여
		//        .formLogin()
		//				// 넥사크로 로그인 페이지를 사용
		//				.loginPage("/ui/")
		//				// 인증에 대한 권한 처리를 필터를 사용하여 실행
		//				.loginProcessingUrl("/com/login")
		//				// 인증 페이지는 권한을 할당
		//				.permitAll()
		//        .and()
        //.and().exceptionHandling() .authenticationEntryPoint(sfd2022AuthenticationEntrypoint()) # class@Sfd2022NexacroAuthenticationEntrypoint
        //.addFilterBefore(authenticationJwtFilter(), Sfd2022NexacroAuthenticationFilter.class) # class@Sfd2022NexacroAuthenticationJwtFilter
	}
	
	
	/**
	 * 인증 완료시 성공 시 처리하는 처리기 빈
	 * @return
	 */
	@Bean
	public NexacroAuthenticationSuccessHandler nexacroAuthenticationSuccessHandler() {
		
		NexacroAuthenticationSuccessHandler nexacroAuthenticationSuccessHandler = new NexacroAuthenticationSuccessHandler();
		
		return nexacroAuthenticationSuccessHandler;
	}
	
	/**
	 * 인증 실패 시 처리하는 처리기 빈
	 * @return
	 */
	@Bean
	public NexacroAuthenticationFailureHandler nexacroAuthenticationFailureHandler() {
		
		NexacroAuthenticationFailureHandler nexacroAuthenticationFailureHandler = new NexacroAuthenticationFailureHandler();
		
		return nexacroAuthenticationFailureHandler;
	}

	/**
	 * 인증 해제 시 처리하는 처리기 빈
	 * @return
	 * @throws Exception
	 */
	@Bean
	public NexacroUnAuthenticationSuccessHandler sfd2022NexacroUnAuthenticationSuccessHandler() throws Exception {
		
		NexacroUnAuthenticationSuccessHandler sfd2022NexacroUnAuthenticationSuccessHandler = new NexacroUnAuthenticationSuccessHandler();
		
		// 인증 처리를 위한 디테일 서비스 등록
		NexacroUserDetailService nexacroUserDetailService = nexacroUserDetailService();
		
		sfd2022NexacroUnAuthenticationSuccessHandler.setNexacroUserDetailService(nexacroUserDetailService);
		
		return sfd2022NexacroUnAuthenticationSuccessHandler;
	}
	
	@Bean
	public NexacroAuthenticationEntrypoint nexacroAuthenticationEntrypoint() {
		
		NexacroAuthenticationEntrypoint nexacroAuthenticationEntrypoint = new NexacroAuthenticationEntrypoint(loginUrl);
		
		return nexacroAuthenticationEntrypoint;
	}
	
	/**
	 * 넥사크로를 사용한 인증 처리기 필터
	 * @return
	 * @throws Exception
	 */
	@Bean
	public NexacroAuthenticationFilter nexacroAuthenticationFilter() throws Exception {
		
		NexacroAuthenticationFilter nexacroAuthenticationFilter = new NexacroAuthenticationFilter(loginProcessUrl, authenticationManager());
		
		nexacroAuthenticationFilter.setAuthenticationSuccessHandler(nexacroAuthenticationSuccessHandler());
		nexacroAuthenticationFilter.setAuthenticationFailureHandler(nexacroAuthenticationFailureHandler());
		nexacroAuthenticationFilter.setSessionAuthenticationStrategy(sessionControlManagementStorage());
		
		return nexacroAuthenticationFilter;
	}

	@Bean
	public SessionControlManagementStorage sessionControlManagementStorage() {
		
		SessionControlManagementStorage sessionControlManagementStorage = new SessionControlManagementStorage(new SessionRegistryImpl());
		
		sessionControlManagementStorage.setMaximumSessions(1);
		sessionControlManagementStorage.setExceptionIfMaximumExceeded(false);
		
		return sessionControlManagementStorage;
		
	}
	
	// 인증 처리 프로세서
	@Bean 
	public PasswordEncoder passwordEncoder(){
		
		return new NexacroPasswordEncoder(); 
	}
	
	
	@Bean
	public NexacroUserDetailService nexacroUserDetailService() {
		
		NexacroUserDetailService nexacroUserDetailService = new NexacroUserDetailService();
		
		nexacroUserDetailService.setSqlsessionFactory(sqlSessionFactory);
		
		return nexacroUserDetailService;
	}
	
	@Bean
	public NexacroAuthenticationProvider nexacroAuthenticationProvider() {
		NexacroAuthenticationProvider nexacroAuthenticationProvider = new NexacroAuthenticationProvider();
		
		nexacroAuthenticationProvider.setUserDetailsService(nexacroUserDetailService());
		nexacroAuthenticationProvider.setPasswordEncoder(passwordEncoder());
		
		return nexacroAuthenticationProvider;
	}
	
	@Autowired
	private SqlSessionFactory sqlSessionFactory; 
	
	@Value("${iptable.urls.login.entry:/index.html}")
	private String loginUrl;
	
	@Value("${iptable.urls.login.process:/login.do}")
	private String loginProcessUrl;
	
	@Value("${iptable.urls.logout.process:/logout}")
	private String logoutProcessUrl;
	
	@Value("${iptable.urls.ignores:}")
	private String[] ignoreUrls;
	
}

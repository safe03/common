package com.safecnc.comm.scrt;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

/**
 * JWT 토큰 인증 접근 권한을 처리하기 위한 EntryPoint 필터 </br>
 * 
 * @author admin
 * @since 2022-06-16
 * @deprecated JWT 확장 시 작업하기로 함 (현재는 작업 X)
 * @see NexacroAuthenticationJwtFilter
 */
@Deprecated
public class JWTAuthenticationEntrypoint extends BasicAuthenticationEntryPoint {

	public JWTAuthenticationEntrypoint() {
		setRealmName("JWT_REALM");
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		
		super.commence(request, response, authException);
	}

}

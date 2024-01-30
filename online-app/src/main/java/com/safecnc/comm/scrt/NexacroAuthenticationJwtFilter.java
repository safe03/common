package com.safecnc.comm.scrt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT 토큰 인증 접근 권한을 처리하기 위한 EntryPoint 필터 </br>
 * 
 * @author admin
 * @since 2022-06-16
 * @deprecated JWT 확장 시 작업하기로 함 (현재는 작업 X)
 * @see NexacroAuthenticationJwtFilter
 */
@Deprecated
public class NexacroAuthenticationJwtFilter extends OncePerRequestFilter {
	
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
				throws ServletException, IOException {

		filterChain.doFilter(request, response);
	}
}

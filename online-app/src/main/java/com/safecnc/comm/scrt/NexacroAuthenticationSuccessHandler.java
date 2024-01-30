package com.safecnc.comm.scrt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.safecnc.response.NexacroResult;
import com.safecnc.response.NexacroView;

import lombok.extern.slf4j.Slf4j;

/**
 * 인증이 성공할 경우 넥사크로 뷰와 <br/>
 * 넥사크로 디테일을 사용하여 화면 랜더링을 처리하기 위한 처리기 빈 <br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see AuthenticationSuccessHandler
 * @see NexacroUserDetails
 * @see NexacroView
 */
@Slf4j
public class NexacroAuthenticationSuccessHandler implements AuthenticationSuccessHandler{

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		log.info("login success with NexacroAuthenticationSuccessHandler Principal is {}", authentication.getPrincipal());
		
		NexacroView nexacroView;
		Map<String, Object> viewModel;
		Map<String, Object> mapUserDetails;
		
		// 넥사크로 인증의 경우 넥사크로 고유의 뷰 정보를 사용하여 결과를 반환
		if(authentication instanceof NexacroAuthentication)
		{
			NexacroAuthentication sfd2022NexacroAuthentication = (NexacroAuthentication) authentication;
			
			Object details = sfd2022NexacroAuthentication.getDetails();
			
			// 넥사크로 디테일의 경우 넥사크로 뷰로 랜더링 처리
			if(details instanceof NexacroUserDetails) 
			{
				NexacroUserDetails sfd2022NexacroUserDetails = (NexacroUserDetails)details;

				nexacroView = new NexacroView();
				
				viewModel = new HashMap<String, Object>();
				
				mapUserDetails = sfd2022NexacroUserDetails.getMapUserDetails();
				
				// 모델 정보를 등록
				viewModel.put(NexacroView.nexacroResult, new NexacroResult(mapUserDetails));
				
				try {
					nexacroView.render(viewModel, request, response);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authentication) throws IOException, ServletException {
		chain.doFilter(request, response);
	}
}

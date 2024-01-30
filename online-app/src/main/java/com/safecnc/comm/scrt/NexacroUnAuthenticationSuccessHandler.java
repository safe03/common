package com.safecnc.comm.scrt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.safecnc.comm.rtlm.AbstractMapper;
import com.safecnc.response.NexacroResult;
import com.safecnc.response.NexacroView;

import lombok.extern.slf4j.Slf4j;

/**
 * 권한 인증 해지시 뷰 랜더링을 처리하기 위한 처리기 빈<br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see NexacroUnAuthenticationSuccessHandler
 * @see LogoutSuccessHandler
 * @see AbstractMapper
 * @see NexacroUserDetails
 * @see NexacroView
 */
@Slf4j
public class NexacroUnAuthenticationSuccessHandler extends AbstractMapper implements LogoutSuccessHandler{

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		
		log.debug("(Logout) Sfd2022NexacroUnAuthenticationSuccessHandler : {}", authentication.getPrincipal());
		
		Object details = authentication.getDetails();
		
		// 넥사크로를 처리할수 있는 모델 일 경우 이곳에서 처리 
		if(details instanceof NexacroUserDetails) {
			
			// 넥사크로 인증 해제의 경우 해당 처리로 로그를 남긴다.
			if(!Objects.isNull(nexacroUserDetailService)) 
			{
				nexacroUserDetailService.logout(((NexacroUserDetails)details).getUserInfo());
			}
			
			//- 뷰와 모델을 생성하여 화면으로 전송한다.
			NexacroView nexacroView = new NexacroView();
			
			Map<String,Object> viewModel = new HashMap<String, Object>();
			
			// 모델 정보를 등록
			viewModel.put(NexacroView.nexacroResult, new NexacroResult());
			
			try {
				nexacroView.render(viewModel, request, response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	/* 로그아웃 처리를 위한 사용자 디테일 서비스 */
	private NexacroUserDetailService nexacroUserDetailService;
	
	public NexacroUserDetailService getnexacroUserDetailService() {
		return nexacroUserDetailService;
	}

	public void setNexacroUserDetailService(NexacroUserDetailService nexacroUserDetailService) {
		this.nexacroUserDetailService = nexacroUserDetailService;
	}
}

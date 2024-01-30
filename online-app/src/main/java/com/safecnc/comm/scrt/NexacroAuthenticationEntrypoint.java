package com.safecnc.comm.scrt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpMethod;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

import com.safecnc.response.NexacroView;
import com.safecnc.web.handler.AbstractController;

/**
 * 로그인 처리를 위한 Entrypoint Resolver겸 Handler </br>
 * 
 * @author admin
 * @since 2022-06-16
 * @see NexacroAuthenticationFilter
 */
public class NexacroAuthenticationEntrypoint extends LoginUrlAuthenticationEntryPoint {

	public NexacroAuthenticationEntrypoint(String loginFormUrl) {
		super(loginFormUrl);
	}
	
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		
		// POST의 경우 넥사크로 결과값을 반환한다.
		if(HttpMethod.POST.matches(request.getMethod())) 
		{
			invalidPostMessage(request, response);
		}
		else
		{
			super.commence(request, response, authException);
		}
	}
	
	/**
	 * 넥사크로 세션 종료 처리를 위한 메시지 핸들러 함수
	 * @param request
	 * @param response
	 */
	private void invalidPostMessage(HttpServletRequest request, HttpServletResponse response) {
		
		//- 뷰와 모델을 생성하여 화면으로 전송한다.
		NexacroView nexacroView = new NexacroView();
		
		Map<String,Object> viewModel = new HashMap<String, Object>();
		
		// 모델 정보를 등록
		viewModel.put(NexacroView.nexacroResult, AbstractController.invalidSession());
		
		try {
			nexacroView.render(viewModel, request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

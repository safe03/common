package com.safecnc.comm.scrt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.safecnc.response.NexacroResult;
import com.safecnc.response.NexacroView;
import com.safecnc.web.handler.AbstractController;

import lombok.extern.slf4j.Slf4j;

/**
 * 인증이 실패할 경우 처리하기 위한 처리기 빈 <br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see AuthenticationFailureHandler
 * @see AbstractController
 * @see AuthenticationFailureHandler
 * @see AuthenticationException
 * @see NexacroView
 */
@Slf4j
public class NexacroAuthenticationFailureHandler implements AuthenticationFailureHandler, AbstractController{
	
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {

		log.debug("(NexacroAuthenticationFailureHandler) failure message is "+exception.getMessage());
		
		// 넥사크로 뷰를 생성
		NexacroView nexacroView = new NexacroView();
		
		// 넥사크로 뷰의 모델을 등록
		Map<String, Object> viewModel = new HashMap<String, Object>();
		
		// 넥사크로 뷰 컴포넌트를 통하여 뷰 모델을 등록
		viewModel.put("nexacroResult", this.handleException(exception));
		
		try {
			// 넥사크로 뷰 컴포넌트를 통하여 뷰를 랜더링 처리
			nexacroView.render(viewModel, request, response);
		} catch (Exception e) {/*에러는 처리하지 않는다.*/}
	}
	

}

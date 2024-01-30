package com.safecnc.comm.auth;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.WebSocketSession;

import lombok.extern.slf4j.Slf4j;

/**
 * 인증 정보를 보관하는 레포지토리 클래스
 * 
 * @author jhlee
 * @since 2021-10-11
 */
@Slf4j
public class AuthorizationSessionStorage {

	/** 세선을 사용한 인증 저장소 처리 */
	public Map<String, AuthenticationPrinciple<Map<String, Object>>> _authorizationSessionStorage = new HashMap<String, AuthenticationPrinciple<Map<String, Object>>>();

	/**
	 * 인증 정보를 등록하는 함수
	 * 
	 * @param httpServletRequest           요청 객체
	 * @param AuthenticationAzurePrinciple 인증 정보
	 * @return 인증 정보 등록 여부
	 */
	public boolean store(HttpServletRequest httpServletRequest) {
		
		// 세션 출력
		HttpSession session = httpServletRequest.getSession();
		
		// 세션 아이디를 고유 정보로 반환 
		String identifiedById = (String)httpServletRequest.getAttribute(AuthenticationSfd2022Principle.IdentifiedById);

		// 이미 등록 되어 있을 경우 즉시 반환
		if (_authorizationSessionStorage.containsKey(identifiedById)) {

			return true;
		}

		// 신규 접속 저장소를 생성
		AuthenticationSfd2022Principle authenticationSfd2022Principle = new AuthenticationSfd2022Principle();

		// 세션 통합 저장소에 등록
		_authorizationSessionStorage.put(identifiedById, authenticationSfd2022Principle);

		// 세션 등록
		authenticationSfd2022Principle.setSession(session);
		
		return true;
	}

	/**
	 * 인증 정보를 등록하는 함수
	 * 
	 * @param httpServletRequest           요청 객체
	 * @param AuthenticationAzurePrinciple 인증 정보
	 * @return 인증 정보 등록 여부
	 */
	public boolean store(HttpServletRequest httpServletRequest, AuthenticationSfd2022Principle Authorization) {
		
		// 세션 아이디를 고유 정보로 반환
		String identifiedById = (String)httpServletRequest.getSession().getAttribute(AuthenticationSfd2022Principle.IdentifiedById);
		
		// 이미 등록 되어 있을 경우 즉시 반환
		if (_authorizationSessionStorage.containsKey(identifiedById)) {

			// 이전 인증 정보와 신규 인증 정보를 확인하여 인증 확인 처리
			if (_authorizationSessionStorage.get(identifiedById) == Authorization) {

				// 이전 인증정보와 동일할 경우 정상 반환
				return true;
			} else {

				return false;
			}
		}

		// 세션 통합 저장소에 등록
		_authorizationSessionStorage.put(identifiedById, Authorization);
		
		// 세션 등록
		Authorization.setSession(httpServletRequest.getSession());

		return true;
	}

	/**
	 * 인증 정보를 반환하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public AuthenticationPrinciple<Map<String,Object>> load(HttpServletRequest httpServletRequest) {

		AuthenticationPrinciple<Map<String,Object>> authenticationAzurePrinciple;

		// 세션 아이디를 고유 정보로 반환
		String identifiedById = (String)httpServletRequest.getAttribute(AuthenticationSfd2022Principle.IdentifiedById);

		// 인증 정보를 조회
		authenticationAzurePrinciple = _authorizationSessionStorage.get(identifiedById);

		// 인증 정보를 반환
		return authenticationAzurePrinciple;
	}
	
	/**
	 * 인증 정보를 반환하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public AuthenticationPrinciple<Map<String,Object>> load(WebSocketSession webSocketSession) {
		
		Iterator<AuthenticationPrinciple<Map<String, Object>>> authenticationPrinciples = _authorizationSessionStorage.values().iterator();
		
		AuthenticationPrinciple<Map<String, Object>> authenticationPrinciple;
		
		while(authenticationPrinciples.hasNext()) {
			authenticationPrinciple = authenticationPrinciples.next();
			
			if(!Objects.isNull(authenticationPrinciple)) {
				
				// 소켓 세션이 같은 경우 해당 인증을 반환
				if(authenticationPrinciple.getSocket().getWebSocketSession() == webSocketSession) {
					
					return authenticationPrinciple;
				}
			}
			
		}
		
		// 인증 정보를 반환
		return null;
	}
	
	/**
	 * 인증 정보를 반환하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public AuthenticationPrinciple<Map<String,Object>> load(String identifiedById) {
		
		AuthenticationPrinciple<Map<String,Object>> authenticationAzurePrinciple;
		
		// 인증 정보를 조회
		authenticationAzurePrinciple = _authorizationSessionStorage.get(identifiedById);
		
		// 인증 정보를 반환
		return authenticationAzurePrinciple;
	}
	
	/**
	 * 인증 정보를 제거 하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public boolean unload(HttpServletRequest httpServletRequest) {

		// 세션 아이디를 고유 정보로 반환
		String identifiedById = (String)httpServletRequest.getAttribute(AuthenticationSfd2022Principle.IdentifiedById);
		
		// 등록 된 인가 정보가 있을 경우
		if(_authorizationSessionStorage.containsKey(identifiedById)) {
			
			// 접속 정보 삭제
			unloadSession(identifiedById);
			
			// 인가 정보 삭제
			_authorizationSessionStorage.remove(identifiedById); 
		}
		
		return true;
	}
	
	/**
	 * 인증 정보를 제거 하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public boolean unload(String identifiedById) {
		
		// 등록 된 인가 정보가 있을 경우
		if ( _authorizationSessionStorage.containsKey ( identifiedById ) ) 
		{
			log.debug("identifiedById : {}", _authorizationSessionStorage.containsKey(identifiedById));
			// 접속 정보 삭제
			unloadSession(identifiedById);
			
			// 인가 정보 삭제
			_authorizationSessionStorage.remove(identifiedById); 
		}
		

		
		return true;
	}

	/**
	 * 인증 정보를 반환하는 함수
	 * 
	 * @param httpServletRequest 요청 객체
	 * @return 인증 정보
	 */
	public AuthenticationPrinciple<Map<String,Object>> loadNewInstance(HttpServletRequest httpServletRequest) {

		// 인증 정보 등록
		store(httpServletRequest);

		return load(httpServletRequest);
	}
	
	private void unloadSession(String identifiedById) {
		
		try {
			
			AuthenticationPrinciple<Map<String,Object>> authenticationPrinciple = load(identifiedById);
			
			if(!Objects.isNull(authenticationPrinciple)) {
				
				WebSocketSession webSocketSession = authenticationPrinciple.getSocket().getWebSocketSession();
				
				if(!Objects.isNull(webSocketSession)) {
					
					if(webSocketSession.isOpen()) {
						
						webSocketSession.close();
					}
					
				}
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}

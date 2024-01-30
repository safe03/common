package com.safecnc.comm.auth;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.socket.WebSocketSession;

/**
 * 권한 정보를 저장 하고 반환하기 위한 고유 클래스
 * 
 * @author jhlee
 * @since 2021-10-11
 */
public class AuthorizationHolder {
	
	/** 세션 값을 처리 하기 위한 클래스 */
	private static AuthorizationSessionStorage authorizationSessionStorage = new AuthorizationSessionStorage();
	
	/**
	 * 권한 정보를 확인하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static AuthenticationPrinciple<Map<String,Object>> getAuthenticationPrinciple(HttpServletRequest httpServletRequest) {
		
		Object str_identifiedById = httpServletRequest.getSession().getAttribute(AuthenticationPrinciple.IdentifiedById);
		
		if(Objects.isNull(str_identifiedById)) {
			return null;
		}
		
		return AuthorizationHolder.getAuthenticationPrinciple((String)str_identifiedById);
	}
	
	/**
	 * 권한 정보를 확인하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static AuthenticationPrinciple<Map<String,Object>> getAuthenticationPrinciple(String httpServletRequest) {
		
		return getAuthorizationSessionStorage().load(httpServletRequest);
	}
	
	/**
	 * 권한 정보를 확인하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static AuthenticationPrinciple<Map<String,Object>> getAuthenticationPrinciple(WebSocketSession webSocketSession) {
		
		return getAuthorizationSessionStorage().load(webSocketSession);
	}
	
	/**
	 * 권한 정보를 제거하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static void removeAuthenticationPrinciple(HttpServletRequest httpServletRequest) {
		
		// 종료 시간을 0으로 처리 하여 토큰을 만료 시킨다.
		authorizationSessionStorage.unload(httpServletRequest);
	}
	
	/**
	 * 권한 정보를 제거하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static void removeAuthenticationPrinciple(String httpServletRequest) {
		
		// 종료 시간을 0으로 처리 하여 토큰을 만료 시킨다.
		authorizationSessionStorage.unload(httpServletRequest);
	}
	
	/**
	 * 권한 정보를 확인하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static Map<String,Object> getUserInfo(HttpServletRequest httpServletRequest) {
		
		Map<String,Object> user_info = null;
		
		// 인증 정보를 확인한다. 
		AuthenticationPrinciple<Map<String,Object>> authenticationPrinciple = getAuthenticationPrinciple(httpServletRequest);
		
		// 인가 정보가 있을 경우 
		if(Objects.isNull(authenticationPrinciple)) {
			
			return new HashMap<String, Object>();
		}
		
		// 사용자의 정보가 사용기한이 종료 될 경우 기존 사용자 정보 제거 후 빈 값 처리
		if(authenticationPrinciple.isExpiredDate()) {
			
			// 기존 사용자 정보 제거
			removeAuthenticationPrinciple(httpServletRequest);
			
			return new HashMap<String, Object>();
		}
		
		user_info = authenticationPrinciple.getUserInfo();
		
		// 사용자 정보가 없을 경우 에러 대비를 위한 빈 값 처리
		if(Objects.isNull(user_info)) { 
			
			return new HashMap<String, Object>();
		}
		
		return user_info;
	}
	
	/**
	 * 권한 정보를 확인하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public static Map<String,Object> getUserInfo(String httpServletRequest) {
		
		Map<String,Object> user_info = null;
		
		// 인증 정보를 확인한다. 
		AuthenticationPrinciple<Map<String,Object>> authenticationPrinciple = getAuthenticationPrinciple(httpServletRequest);
		
		// 인가 정보가 있을 경우 
		if(Objects.isNull(authenticationPrinciple)) {
			
			return new HashMap<String, Object>();
		}
		
		// 사용자의 정보가 사용기한이 종료 될 경우 기존 사용자 정보 제거 후 빈 값 처리
		if(authenticationPrinciple.isExpiredDate()) {
			
			// 기존 사용자 정보 제거
			removeAuthenticationPrinciple(httpServletRequest);
			
			return new HashMap<String, Object>();
		}
		
		user_info = authenticationPrinciple.getUserInfo();
		
		// 사용자 정보가 없을 경우 에러 대비를 위한 빈 값 처리
		if(Objects.isNull(user_info)) { 
			
			return new HashMap<String, Object>();
		}
		
		return user_info;
	}
	
	/**
	 * 전역으로 세션 스토리지를 처리하기 위한 지원 메소드
	 * @return AuthorizationSessionStorage
	 */
	public static AuthorizationSessionStorage getAuthorizationSessionStorage() {
		
		return authorizationSessionStorage;
	}

	/**
	 * 세션 스토리지를 등록하기 위한 지원 메소드
	 * @param authorizationSessionStorage
	 */
	public void setAuthorizationSessionStorage(AuthorizationSessionStorage authorizationSessionStorage) {
		
		// 단일 대상으로만 지원
		if(Objects.isNull(AuthorizationHolder.authorizationSessionStorage)) {
			
			AuthorizationHolder.authorizationSessionStorage = authorizationSessionStorage;
		}
	}
}

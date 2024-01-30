package com.safecnc.comm.auth;

/**
 * 인증을 처리하는 인터페이스
 * 
 * @author jhlee
 * @since 2021-10-11
 */
public interface AuthenticationPrinciple<T> {
	
	/**
	 * 인가 일자 여부를 확인
	 * @return 인가 여부
	 */
	boolean isExpiredDate();
	
	
	/**
	 * 인가 여부를 확인
	 * @return 인가 여부
	 */
	boolean isAuthorization();
	
	
	/**
	 * 사용자 토큰 정보를 확인
	 * @return 사용자 정보
	 */
	String getTokenId_();
	
	
	/**
	 * 사용자 정보를 반환하는 함수
	 * @return 사용자 정보
	 */
	T getUserInfo();
	
	
	/**
	 * 접속 정보를 검증하기 위한 고유 번호를 반환하는 함수
	 * @return 사용자 정보
	 */
	String getNonce();
	
	/**
	 * 접속 정보를 검증하기 위한 고유 소켓를 반환하는 함수
	 * @return 사용자 정보
	 */
	AuthenticationSfd2022Socket getSocket();
	

	final public static String IdentifiedById = "USER_ID";
	final public static String IdentifiedByPw = "PASS_WORD";
	final public static String IdentifiedSeatID = "";
}

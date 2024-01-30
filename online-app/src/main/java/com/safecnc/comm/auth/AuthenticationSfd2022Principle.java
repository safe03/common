package com.safecnc.comm.auth;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpSession;

import org.springframework.web.socket.WebSocketSession;

/**
 * oAuth를 사용하여 인증을 처리하는 인증 전용 클래스
 * 
 * @author jhlee
 * @since 2021-10-11
 */
public class AuthenticationSfd2022Principle implements AuthenticationPrinciple<Map<String, Object>>, AuthenticationSfd2022Socket {
	
	
	@Override
	public boolean isExpiredDate() {
		
		return false;
	}
	
	@Override
	public String getTokenId_() {
		
		return this.session.getId();
	}

	@Override
	public String getNonce() {
		
		
		return "[text::nonce]";
	}

	@Override
	public boolean isAuthorization() {
		
		// 상세 검증은 이곳에서 처리
		// 사용자 아이디가 등록이 되어 있을 경우 사용자 검증 완료로 처리
		return !Objects.isNull(this._userInfo.get(this.IdentifiedById));
	}

	@Override
	public Map<String, Object> getUserInfo() {
		
		return this._userInfo;
	}

	public void setUserInfo(Map<String, Object> _userInfo) {
		
		this._userInfo = _userInfo;
	}
	
	

	/** --------------- User Information Repository (Matching User Details) ---------------- */
	
	public HttpSession getSession() {
		return session;
	}

	public void setSession(HttpSession session) {
		this.session = session;
	}

	public WebSocketSession getWebSocketSession() {
		
		return this.webSocketSession;
	}

	public void setWebSocketSession(WebSocketSession webSocketSession) {
		this.webSocketSession = webSocketSession;
	}

	@Override
	public AuthenticationSfd2022Socket getSocket() {
		
		return this;
	}



	/** local storage to store user information(key-value type) */
	private Map<String, Object> _userInfo = new HashMap<String, Object>();
	
	/* http session */
	private HttpSession session;
	
	/* http socket session */
	private WebSocketSession webSocketSession;
}

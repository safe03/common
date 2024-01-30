package com.safecnc.comm.auth;

import javax.servlet.http.HttpSession;

import org.springframework.web.socket.WebSocketSession;

/**
 * 
 * 
 * @author jhlee
 * @since 2021-10-11
 */
public interface AuthenticationSfd2022Socket {
	
	public HttpSession getSession();

	public void setSession(HttpSession session);

	public WebSocketSession getWebSocketSession();

	public void setWebSocketSession(WebSocketSession webSocketSession);
}

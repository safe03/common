package com.safecnc.comm.auth;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.safecnc.comm.srvc.ComLoginService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
//@WebSocket(url="/com/userSession.ws")
public class AuthenticationJConnectionService extends TextWebSocketHandler implements ServletContextListener {
	
	@Override
	public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
		
		//- toss message
		sendMessage(webSocketSession, "1", "connected");
		
		log.debug("session connected with websocket :: {}", webSocketSession.getId());
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus status) throws Exception {

		if(webSocketSession.isOpen())
		{
			// get principle
			AuthenticationPrinciple<Map<String,Object>> principle = AuthorizationHolder.getAuthenticationPrinciple(webSocketSession);

			// logout
			if(!Objects.isNull(principle)){
				
				service.logoutOk(principle.getUserInfo());
			}
			
			webSocketSession.close();
		}
		
	}
	
	/**
	 * 웹 소켓을 사용한 기본적인 브로커 샘플을 정의한다. 
	 */
	@Override
	protected void handleTextMessage(WebSocketSession webSocketSession, TextMessage message) throws Exception {
		
		/**
		 * destination과 payload를 사용하여 목적지와 메시지를 출력
		 */
		String str_replacedJsonMessage = message.getPayload().replaceAll("\n", "\\n");
		
		Map<String, Object> jsonData = new JSONParser(str_replacedJsonMessage).parseObject();
		
		Object destinationObject = jsonData.get("destination");
		Object messageObject     = jsonData.getOrDefault("payload", "notification");
		
		log.debug("");
		log.debug("=================================================");
		log.debug("session connected : ("+destinationObject+ ")"+webSocketSession.getId());
		log.debug("=================================================");
		log.debug("");
	
		// empty destination
		if(Objects.isNull(destinationObject)) {
			
			sendMessage(webSocketSession, "-1", "destination is empty, check your connection url");
		} else {
			
			AuthenticationPrinciple<Map<String,Object>> authenticationPrinciple = AuthorizationHolder.getAuthenticationPrinciple(destinationObject.toString());
			
			//- 접속이 강제로 종료된 경우 
			if(Objects.isNull(authenticationPrinciple)) {
				
				sendMessage(webSocketSession, "-1", "connection losted, please reconnection");
				
				return;
			}
			
			AuthenticationSfd2022Socket authenticationSfd2022Socket = authenticationPrinciple.getSocket();
			
			// check web socket
			if(Objects.isNull(authenticationSfd2022Socket.getWebSocketSession())) {
				
				authenticationSfd2022Socket.setWebSocketSession(webSocketSession);
				
				sendMessage(webSocketSession, "1", "success connected [ with WebSocket ]");
				
				return;
			} else {
				
				sendMessage(webSocketSession, "1", "success connected");
				
				return;
			}
		}
		
		sendMessage(webSocketSession, "-1", "not supported message type");
	}
	
	public static void sendMessage(WebSocketSession webSocketSession, String send_code, String send_message) throws IOException {
		
		// 소켓이 없는 경우는 이미 이전의 소켓이 끊어졌을 때이며 ( 이벤트는 화면에서 처리 )
		// 이때는 이벤트를 출력하지 않아도 되기 때문에 메시지 출력을 제외한다.
		if(!Objects.isNull(webSocketSession)) {
			
			// 소켓이 먼저 열려 있을 경우 소켓을 통하여 메시지를 전송한다.
			if(webSocketSession.isOpen()) {
				
				webSocketSession.sendMessage(new TextMessage("{\"code\" : "+send_code+", \"payload\":\""+send_message+"\", \"id\" : \""+webSocketSession.getId()+"\"}"));
			}
		}
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		
		AuthorizationSessionStorage authorizationSessionStorage = AuthorizationHolder.getAuthorizationSessionStorage();
		
		Map<String, AuthenticationPrinciple<Map<String, Object>>> closeablePrinciple = authorizationSessionStorage._authorizationSessionStorage;
		
		Iterator<String> principleIterator = closeablePrinciple.keySet().iterator();
		
		String str_loginID;
		
		while(principleIterator.hasNext()) {
			
			str_loginID = principleIterator.next();
			
			// 로그아웃 처리
			service.logoutOk(closeablePrinciple.get(str_loginID).getUserInfo());
		}
		
		ServletContextListener.super.contextDestroyed(sce);
	}
	

    @Resource(name="ComLoginService")
    private ComLoginService service;
}

package com.safecnc.comm.scrt;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;

public class SessionControlManagementStorage extends ConcurrentSessionControlAuthenticationStrategy{

	public SessionControlManagementStorage(SessionRegistry sessionRegistry) {
		super(sessionRegistry);
	}

	@Override
	protected int getMaximumSessionsForThisUser(Authentication authentication) {
		
		// 단일 세션 테스트 후 추가 작업 예정
		return super.getMaximumSessionsForThisUser(authentication);
	}
	
	
}

package com.safecnc.comm.scrt;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

/**
 * 인증을 처리하기 위한 고유 인증 객체 <br/>
 * 권한은 애플리케이션 내부에서 검사 할 것이므로 인증 권한은 USER로 통일하여 처리한다. <br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see UsernamePasswordAuthenticationToken
 * @see AbstractAuthenticationToken
 * @see GrantedAuthority
 */
public class NexacroAuthentication extends UsernamePasswordAuthenticationToken {

	private static final long serialVersionUID = 1L;

	public NexacroAuthentication(Object principal, Object credentials) {
		super(principal, credentials);
	}

	public NexacroAuthentication(Object principal, Object credentials,
			Collection<? extends GrantedAuthority> authorities) {
		super(principal, credentials, authorities);
	}
}
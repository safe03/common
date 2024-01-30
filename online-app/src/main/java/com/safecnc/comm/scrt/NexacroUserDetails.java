package com.safecnc.comm.scrt;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 권한 인증과 관련 된 사용자 정보 셋<br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see UserDetails
 * @see GrantedAuthority
 */
public class NexacroUserDetails implements UserDetails{

	private static final long serialVersionUID = 1L;
	
	private Map<String,Object> userInfo;
	private Map<String,Object> mapUserDetails;
	
	public NexacroUserDetails(Map<String, Object> userInfo) {
		this.userInfo = userInfo;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getPassword() {
		
		return userInfo.getOrDefault("PASS_WORD", "").toString();
	}

	@Override
	public String getUsername() {
		
		return userInfo.getOrDefault("USER_NM", "").toString();
	}

	// 계정 만료 여부 [true = 미 만료, false = 만료]
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	// 잠금 여부 [true = 미 잠금, false = 잠금]
	@Override
	public boolean isAccountNonLocked() {
		
		return userInfo.getOrDefault("LOCK_YSNO", "0").equals("1");
	}

	// 비밀번호 만료 여부 [true = 만료전, false = 만료]
	@Override
	public boolean isCredentialsNonExpired() {
		
		return true;
	}

	// 사용 여부 [true = 사용, false = 미사용]
	@Override
	public boolean isEnabled() {
		
		return userInfo.getOrDefault("USE_YSNO", "0").equals("1");
	}
	
	public Map<String, Object> getUserInfo() {
		
		return userInfo;
	}

	public Map<String, Object> getMapUserDetails() {
		
		return mapUserDetails;
	}
	
	public void setMapUserDetails(Map<String, Object> mapUserDetails) {
		
		this.mapUserDetails = mapUserDetails;
	}

	@Override
	public String toString() {
		return "SafeCncNexacroUserDetails [userInfo=" + userInfo + ", mapUserDetails=" + mapUserDetails + "]";
	}
	
}

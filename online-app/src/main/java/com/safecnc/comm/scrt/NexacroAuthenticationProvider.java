package com.safecnc.comm.scrt;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.extern.slf4j.Slf4j;

/**
 * 기본 인증을 처리하기 위한 필수 처리기
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see AuthenticationProvider
 * @see AuthenticationException
 * @see Authentication
 * @see NexacroUserDetailService
 * @see NexacroUserDetails
 * @see NexacroAuthentication
 */
@Slf4j
public class NexacroAuthenticationProvider implements AuthenticationProvider{

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		// 비밀번호가 없는 사용자이므로 오류 처리
		if(Objects.isNull(authentication.getCredentials()))
		{
			throw new UsernameNotFoundException(reloadableResourceBundleMessageSource.getMessage("1101", null, Locale.ENGLISH));
		}

		Map<String,Object> requestDetails = (Map<String,Object>)authentication.getDetails();
		
		// 디테일 서비스(dao 접근)이 있을 경우 해당 경우 처리
		if(!Objects.isNull(userDetailsService) && userDetailsService instanceof NexacroUserDetailService)
		{
			// 사용자 검증 실행
			try {
				// 사용자 등록 여부 확인
				NexacroUserDetails nexacroUserDetails = (NexacroUserDetails)userDetailsService.loadUserByUsername(authentication.getName());
			
				String obj_PASS_WORD = (String)nexacroUserDetails.getPassword();
				
				// 비밀번호가 다를 경우 오류 처리
				if(!this.passwordEncoder.matches(authentication.getCredentials().toString(), obj_PASS_WORD))
				{
					throw new UsernameNotFoundException(reloadableResourceBundleMessageSource.getMessage("1102", new Object[] {1,5}, defaultErrorMessage, Locale.ENGLISH));
				}
				
				// 화면에서 받아온 언어 코드가 있을 경우 해당 언어 코드로 셋팅
				if(!"".equals(requestDetails.getOrDefault("LANG_CODE", "")))
				{
					nexacroUserDetails.getUserInfo().put("LANG_CODE", requestDetails.get("LANG_CODE"));
				}
				
				// 1. 화면에서 받아온 remember me 코드를 셋팅
				// 2. 서비스에서 받아온 ip, mac address 셋팅
				nexacroUserDetails.getUserInfo().put("REMEMBER_ME", requestDetails.get("REMEMBER_ME"));
				nexacroUserDetails.getUserInfo().put("WORK_IPXX"  , requestDetails.get("WORK_IPXX"));
				nexacroUserDetails.getUserInfo().put("WORK_MACX"  , requestDetails.get("WORK_MACX"));
				nexacroUserDetails.getUserInfo().put("WORK_SESS"  , requestDetails.get("WORK_SESS"));
				nexacroUserDetails.getUserInfo().put("WORK_VPNX"  , requestDetails.get("WORK_VPNX"));
				nexacroUserDetails.getUserInfo().put("FAIL_YSNO"  , requestDetails.get("FAIL_YSNO"));
				nexacroUserDetails.getUserInfo().put("FAIL_MSGX"  , requestDetails.get("FAIL_MSGX"));
				
				// 사용자 정보 추가 조회
				UserDetails innerUserDetails = userDetailsService.getMapUserDetails(nexacroUserDetails);
				
				// 하단에서 타입에 따른 리졸빙 처리가 되어 있으므로 해당 타입 변경은 유효
				// 타입을 변경한 다음 사용자 정보를 등록 후 반환
				// 권한은 기본 사용자 권한으로 할당 ( 앱 내부에서 권한을 재 할당 하므로 )
				NexacroAuthentication nexacroAuthentication = new NexacroAuthentication(authentication.getPrincipal(), authentication.getCredentials(), Arrays.asList(new SimpleGrantedAuthority("USER")));
				
				nexacroAuthentication.setDetails(innerUserDetails);
	
				// 인증이 성공적으로 이루어질 경우 로그인 로그를 등록한다.
				if(innerUserDetails instanceof NexacroUserDetails)
				{
					userDetailsService.login(((NexacroUserDetails)innerUserDetails).getUserInfo());
				}
				
				return nexacroAuthentication;

			}
			catch(Exception e)
			{
				
				e.printStackTrace();
				// 비밀번호가 틀릴 경우 에러 출력
				requestDetails.put("USER_ID"    , authentication.getPrincipal().toString());
				requestDetails.put("FAIL_YSNO"  , "1");
				requestDetails.put("FAIL_MSGX"  , "올바르지 않은 #아이디# 또는 #비밀번호# 입력");
				
				userDetailsService.login(requestDetails);
				
				throw new UsernameNotFoundException(reloadableResourceBundleMessageSource.getMessage("1102", new Object[] {1,5}, defaultErrorMessage, Locale.ENGLISH));
			}
		}
		else
		{
			// 서포트 할 수 없는 서비스를 지정하였을 경우 에러 출력
			requestDetails.put("FAIL_YSNO"  , "1");
			requestDetails.put("FAIL_MSGX"  , "올바르지 않은 #아이디# 또는 #비밀번호# 입력");

			userDetailsService.login(requestDetails);
			
			throw new AuthenticationServiceException(defaultErrorMessage);
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		// 넥사크로 요청으로 들어온 인증 객체를 처리하도록 매핑
		return authentication.isAssignableFrom(NexacroAuthentication.class);
	}
	
	public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
		
		this.passwordEncoder = passwordEncoder;
	}

	protected PasswordEncoder getPasswordEncoder() {
		
		return this.passwordEncoder;
	}

	public void setUserDetailsService(NexacroUserDetailService userDetailsService) {
		
		this.userDetailsService = userDetailsService;
	}
	

	@Autowired
	private ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource;
	
	public final String defaultErrorMessage = "An error occurred while processing."; 
	
	/** 사용자 로그인 처리를 위한 데이터베이스 서비스 객체 */
	private NexacroUserDetailService userDetailsService = null;
	
	/** 비밀번호 암호화 처리를 위한 비밀번호 함호화 객체 */
	private PasswordEncoder passwordEncoder = null;
}

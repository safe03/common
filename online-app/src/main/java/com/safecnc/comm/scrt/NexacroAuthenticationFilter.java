package com.safecnc.comm.scrt;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.lang3.LocaleUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.safecnc.request.NexacroRequest;
import com.safecnc.util.CryptSHA;
import com.safecnc.util.StringUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 인증을 처리할 기본 처리 필터
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see AbstractAuthenticationProcessingFilter
 * @see RequestMatcher
 * @see AuthenticationFailureHandler
 * @see AuthenticationSuccessHandler
 * @see AuthenticationException
 * @see NexacroAuthentication
 * @see AuthenticationProvider
 * @see AuthenticationManager
 */
@Slf4j
public class NexacroAuthenticationFilter extends AbstractAuthenticationProcessingFilter{

	public NexacroAuthenticationFilter(RequestMatcher requiresAuthenticationRequestMatcher,
			AuthenticationManager authenticationManager) {
		super(requiresAuthenticationRequestMatcher, authenticationManager);
	}

	public NexacroAuthenticationFilter(RequestMatcher requiresAuthenticationRequestMatcher) {
		super(requiresAuthenticationRequestMatcher);
	}

	public NexacroAuthenticationFilter(String defaultFilterProcessesUrl,
			AuthenticationManager authenticationManager) {
		super(defaultFilterProcessesUrl, authenticationManager);
	}

	public NexacroAuthenticationFilter(String defaultFilterProcessesUrl) {
		super(defaultFilterProcessesUrl);
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException, IOException, ServletException {
		
		Authentication authenticatedAuthentication = SecurityContextHolder.getContext().getAuthentication();

		// remember me service check
		boolean isRemember = false;
		
		if(!Objects.isNull(authenticatedAuthentication))
		{

			Object authenticatedUserDetails = authenticatedAuthentication.getDetails();
			
			// 넥사크로에서 인증받은 객체의 경우 remember me 서비스를 파라미터로 처리한다.
			if(authenticatedUserDetails instanceof NexacroUserDetails)
			{
				NexacroUserDetails sfd2022NexacroUserDetails = (NexacroUserDetails)authenticatedUserDetails;
				
				Map<String,Object> suUserInfo = sfd2022NexacroUserDetails.getUserInfo();
				
				String str_rememberMe = (String)suUserInfo.getOrDefault("REMEMBER_ME", "0");
				
				// remember me service
				if("1".equals(str_rememberMe))
				{
					isRemember = true;
				}
			}
		}
		
		// 이미 세션으로 인증된 사용자에게는 즉시 인증 정보를 반환하여 준다.
		if(!Objects.isNull(authenticatedAuthentication) && authenticatedAuthentication.isAuthenticated() && isRemember)
		{
			return authenticatedAuthentication;
		}
		else
		{
			AuthenticationManager authenticationManager = getAuthenticationManager();
			
			HttpServletRequest httpServletRequest = (HttpServletRequest) request;
			
			Map<String,Object> authenticationMap;
			
			try {
				// 넥사크로 어뎁터를 사용하여 요청을 처리
				NexacroRequest nexacroRequest = new NexacroRequest(httpServletRequest);
			
				// 넥사크로 파라미터를 등록
				authenticationMap = nexacroRequest.getMapVariableList(); 
			}
			catch(Exception e)
			{
				authenticationMap = new HashedMap<String, Object>();
			}
			
			String userName = authenticationMap.getOrDefault("USER_ID", "").toString();
			String passWord = authenticationMap.getOrDefault("PASS_WORD", "").toString();
			
			// base64로 디코딩
			userName = !"".equals(userName) ? CryptSHA.base64Decode(userName) : userName;
			passWord = !"".equals(passWord) ? CryptSHA.base64Decode(passWord) : passWord;
			
			log.info("(Login) userName is {}", userName);
			log.info("(Login) passWord is {}", passWord);
			
			// 인증 요청 객체를 생성하여 인증에 돌입
			NexacroAuthentication requestAuthentication = new NexacroAuthentication(userName, passWord);
			
			// 인증 요청 파라미터를 등록 하여 인증 객체로 전송
			String langCode = authenticationMap.getOrDefault("LANG_CODE", "").toString();
			String reMember = authenticationMap.getOrDefault("REMEMBER_ME", "0").toString();
			String workIpxx = getClientIP(request);
			String workMacx = getClientMac(request);
			String workSess = request.getSession().getId();
			String workVpnx = getRouterIP();

			log.info("(Login) langCode is {}", langCode);
			log.info("(Login) reMember is {}", reMember);
			log.info("(Login) ipxxAddr is {}", workIpxx);
			log.info("(Login) macxAddr is {}", workMacx);
			log.info("(Login) sessIdxx is {}", workSess);
			log.info("(Login) workVpnx is {}", workVpnx);
			
			Map<String,String> requestUsetDetails = new HashMap<String,String>();

			requestUsetDetails.put("REMEMBER_ME", reMember);
			requestUsetDetails.put("LANG_CODE"  , langCode);
			requestUsetDetails.put("WORK_IPXX"  , workIpxx);
			requestUsetDetails.put("WORK_MACX"  , workMacx);
			requestUsetDetails.put("WORK_SESS"  , workSess);
			requestUsetDetails.put("WORK_VPNX"  , workVpnx);
			requestUsetDetails.put("FAIL_YSNO"  , "0");
			requestUsetDetails.put("FAIL_MSGX"  , "#Successful#");
			
			requestAuthentication.setDetails(requestUsetDetails);
			
			try {
				
				// 인증 매니져를 통하여 인증 요청
				NexacroAuthentication nexacroAuthentication = (NexacroAuthentication)authenticationManager.authenticate(requestAuthentication);

				log.info("(debug) Sfd2022NexacroAuthenticationFilter {}", nexacroAuthentication.getPrincipal());
				
				// 세션에 접속 정보 등록
				setSessionAttributes(request, nexacroAuthentication);
				
				return nexacroAuthentication;
			}
			catch(AuthenticationException e)
			{
				unsuccessfulAuthentication(httpServletRequest, response, e);
				e.printStackTrace();
				throw e;
			}
		}
	}

	/**
	 * 사용자 정보를 세션에 등록 한다.
	 * @param request
	 * @param mapUserDetails
	 */
	private void setSessionAttributes(HttpServletRequest request, NexacroAuthentication nexacroAuthentication)
	{
		// 세션을 오픈
		HttpSession httpSession = request.getSession(true);
		
		// 넥사크로 디테일로부터 넥사크로 사용자 데이터를 불러옴
		NexacroUserDetails nexacroUserDetails = (NexacroUserDetails)nexacroAuthentication.getDetails();
		
		Map<String, Object> userInfo      = nexacroUserDetails.getUserInfo();
		
		// 데이터를 가져온 다음 세션과 사용자 디테일에 등록
		Object obj_WORK_USID   = userInfo.get("USER_ID");
		Object obj_WORK_USNM   = userInfo.get("USER_NM");
		//Object obj_WORK_USTP   = userInfo.get("USER_TYPE");
		Object obj_WORK_IPXX   = userInfo.get("WORK_IPXX");
		Object obj_WORK_COMP   = userInfo.get("COMP_ID");
		Object obj_WORK_MACX   = userInfo.get("WORK_MACX");
		Object obj_WORK_VPNX   = userInfo.get("WORK_VPNX");
		Object obj_WORK_SSID   = userInfo.get("WORK_SESS");
		Object obj_WORK_USGB   = userInfo.get("USR_GB");
		Object obj_WORK_LANG   = userInfo.get("LANG_CODE");
		
		// 이전 데이터 처리를 위하여 등록
		httpSession.setAttribute ( "WORK_USID"   , obj_WORK_USID   ); // 작업자 아이디
		httpSession.setAttribute ( "USER_ID"     , obj_WORK_USID   ); // 사용자 아이디(작업자 아이디와 동일)
		httpSession.setAttribute ( "WORK_USNM"   , obj_WORK_USNM   ); // 작업자 명칭
		httpSession.setAttribute ( "USER_NM"     , obj_WORK_USNM   ); // 사용자 명칭(작업자 명칭과 동일)
		//httpSession.setAttribute ( "USER_TYPE"   , obj_WORK_USTP   ); // 사용자 타입(일반,관리자...)
		httpSession.setAttribute ( "WORK_IP"     , obj_WORK_IPXX   ); // 작업자 아아피
		httpSession.setAttribute ( "IPXX_ADDR"   , obj_WORK_IPXX   ); // 작업자 아아피
		httpSession.setAttribute ( "USER_IP"     , obj_WORK_IPXX   ); // 사용자 아아피(작업자 아아피와 동일)
		httpSession.setAttribute ( "WORK_COMP"   , obj_WORK_COMP   ); // 회사 아이디
		httpSession.setAttribute ( "COMP_ID"     , obj_WORK_COMP   ); // 회사 아이디
		httpSession.setAttribute ( "WORK_MAC"    , obj_WORK_MACX   ); // 접속 MAC 주소
		httpSession.setAttribute ( "MACX_ADDR"   , obj_WORK_MACX   ); // 접속 MAC 주소
		httpSession.setAttribute ( "VPN_CONN_IP" , obj_WORK_VPNX   ); // 게이트 아이피 주소
		httpSession.setAttribute ( "SESS_ID"     , obj_WORK_SSID   ); // 세션 아이디
		httpSession.setAttribute ( "WORK_USR_GB" , obj_WORK_USGB   ); // 사용자 구분 코드
		
		
		// 세션에 등록할 속성값
		httpSession.setAttribute ( "WORK_USID"   , obj_WORK_USID  ); // 작업자 아이디
		httpSession.setAttribute ( "WORK_USNM"   , obj_WORK_USNM  ); // 작업자 명칭
		//httpSession.setAttribute ( "WORK_USTP"   , obj_WORK_USTP  ); // 사용자 타입(일반,관리자...)
		httpSession.setAttribute ( "WORK_IPXX"   , obj_WORK_IPXX  ); // 작업자 아아피
		httpSession.setAttribute ( "WORK_COMP"   , obj_WORK_COMP  ); // 회사 아이디
		httpSession.setAttribute ( "WORK_MACX"   , obj_WORK_MACX  ); // 접속 MAC 주소
		httpSession.setAttribute ( "WORK_VPNX"   , obj_WORK_VPNX  ); // 게이트 아이피 주소
		httpSession.setAttribute ( "WORK_SESS"   , obj_WORK_SSID  ); // 세션 아이디
		httpSession.setAttribute ( "WORK_USGB"   , obj_WORK_USGB  ); // 사용자 구분 코드
		httpSession.setAttribute ( "WORK_LANG"   , obj_WORK_LANG  ); // 사용자 언어 코드
	}
	

	/**
	 * 클라이언트 IP 획득
	 */
	public String getClientIP(HttpServletRequest request) {
		
		String sLocalAddr = "::0.0.0.0";
		try {
			sLocalAddr = Inet4Address.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			sLocalAddr = request.getLocalAddr();
		}
		return sLocalAddr;
	}

	/**
	 * 클라이언트 MAC 획득
	 */
	public String getClientMac(HttpServletRequest request) {
		String macAddress = "";
		try {
			InetAddress ip = Inet4Address.getLocalHost();
			NetworkInterface mac = NetworkInterface.getByInetAddress(ip);

			if (ip != null) {
				byte[] mc = mac.getHardwareAddress();

				for (int i = 0; i < mc.length; i++) {
					macAddress += (String.format("%02x", mc[i]) + ":");
				}
			}
		} catch (UnknownHostException e) {
			macAddress = "";
		} catch (SocketException e) {
			e.printStackTrace();
			macAddress = "";
		} catch (Exception e) {
			macAddress = "";
		}
		return macAddress;
	}

	/**
	 * IP 내부/외부 아이피 반환
	 * 
	 * @param ipxx
	 * @return
	 */
	private Long getPureIp4(String ipxx) {

		String[] splitedIPv4 = ipxx.split("\\.");

		String str_sliceIP4 = "";

		for (String s4 : splitedIPv4) {
			str_sliceIP4 += StringUtil.rpad(s4, 3, "0");
		}

		return Long.parseLong(str_sliceIP4);
	}
	/**
	 * Router 장비 IP 반환
	 * @param request
	 * @return String
	 */
	
	public String getRouterIP()
	{
        String _255 = "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
        String exIP = "(?:" + _255 + "\\.){3}" + _255;
 
        // Regexp to find the good line
        Pattern pat = Pattern.compile("^\\s*(?:0\\.0\\.0\\.0\\s*){1,2}("+exIP+").*");
        Process proc;
        try {
 
            // netstat
            proc = Runtime.getRuntime().exec("netstat -rn");
      
            InputStream inputstream = proc.getInputStream();
            InputStreamReader inputstreamreader = new InputStreamReader(inputstream);
            BufferedReader bufferedreader = new BufferedReader(inputstreamreader);
    
            // Parsing the result
            String line;
            while ((line = bufferedreader.readLine()) != null) {
                Matcher m = pat.matcher(line);
                
                // This is the good line
                if(m.matches()){
                    // return the first group
                    return m.group(1);
                }
            }
        // can't find netstat
        } catch (IOException ex) {
            //java.util.logging.Logger.getLogger(NetworkManager.class.getName()).log(Level.SEVERE, null, ex);
        	ex.printStackTrace();
            //System.out.println(ex.getMessage());
        }
        
        return null;
    }
	
	public AuthenticationSuccessHandler getAuthenticationSuccessHandler() {
		return authenticationSuccessHandler;
	}

	public void setAuthenticationSuccessHandler(AuthenticationSuccessHandler authenticationSuccessHandler) {
		super.setAuthenticationSuccessHandler(authenticationSuccessHandler);
	}

	public AuthenticationFailureHandler getAuthenticationFailureHandler() {
		return authenticationFailureHandler;
	}

	public void setAuthenticationFailureHandler(AuthenticationFailureHandler authenticationFailureHandler) {
		super.setAuthenticationFailureHandler(authenticationFailureHandler);
	}

	private AuthenticationSuccessHandler authenticationSuccessHandler;
	private AuthenticationFailureHandler authenticationFailureHandler;
}

package com.safecnc.comm.srvc.impl;

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
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.safecnc.comm.auth.AuthenticationJConnectionService;
import com.safecnc.comm.auth.AuthenticationPrinciple;
import com.safecnc.comm.auth.AuthenticationSfd2022Principle;
import com.safecnc.comm.auth.AuthenticationSfd2022Socket;
import com.safecnc.comm.auth.AuthorizationHolder;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.comm.srvc.ComLoginService;
import com.safecnc.request.NexacroRequest;
import com.safecnc.util.CryptSHA;
import com.safecnc.util.SessionUtils;
import com.safecnc.util.StringUtil;
import com.safecnc.web.exception.CustomException;

import lombok.extern.slf4j.Slf4j;

/*******************************************************************
 * <h1>NAME :</h1>
 * <p>
 * 로그인 서비스
 * </p>
 * <h2>DESC :</h2>
 * <p>
 * 설명
 * </p>
 * <h3>REV.:</h3>
 * 
 * <pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
 * </pre>
 ********************************************************************/

@Slf4j
@Service("ComLoginService")
public class ComLoginServiceImpl extends AbstractServiceImpl implements ComLoginService {

	@Resource(name = "ComLoginDao")
	private ComLoginDao comLoginDao;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	/**
	 * <pre>
	 * SAP로그인
	 * </pre>
	 */
	
	/*
	@Override
	public Object processSapLogin(Map<String, Object> searchVo) {
		
		Map<String,Object> hmSearchUserInfo = new HashMap<String, Object>();
		Map<String,Object> hmSearchSapInfo = new HashMap<String, Object>();

		//- 사용자 정보를 조회
		hmSearchUserInfo.put("USER_ID", searchVo.get("WORK_USID"));
		
		Map<String, Object> searchUserInfo = (Map<String, Object>) comLoginDao.processLogin(hmSearchUserInfo);
		
		hmSearchSapInfo.put("I_PERNR", searchVo.get("WORK_USID"));
		hmSearchSapInfo.put("I_PWD"  , searchUserInfo.get("ZPWD"));
		
		Object object = comLoginDao.processSapLogin(hmSearchSapInfo); 
		
		log.debug("{}", object);
		
		return object;
	}
	*/



	/**
	 * 로그인 검증
	 */
	/*
	@Override
	public void loginCheck(Map<String, Object> searchUserInfo) {

		// no use
		// Object obj_IP_ADDR = searchUserInfo.get("IP_ADDR"); // 제한 아이파
		// Object obj_MAC_ADDR = searchUserInfo.get("MAC_ADDR"); // 제한 맥주소
		// Object obj_USE_YSNO = searchUserInfo.get("USE_YSNO"); // 사용여부
		// Object obj_LAST_LOCK_DATE = searchUserInfo.get("LAST_LOCK_DATE"); // 마지막 잠김일자
		// Object obj_CERTI_FAIL_CNT = searchUserInfo.get("CERTI_FAIL_CNT"); // 오 입력 횟수
		// Object obj_CERTI_FAIL_DATE = searchUserInfo.get("CERTI_FAIL_DATE"); // 마지막 오
		// 입력 일자

		// 서팀장님 확인 내용
		// 사용자 처리 로직은 우리쪽에서 하지 않음 2022-03-31
		//Object obj_LOCK_YSNO = searchUserInfo.getOrDefault("LOCK_YSNO", "0");
		//Object obj_PASS_DT = searchUserInfo.get("PASS_DT");
		String str_USER_ID = (String) searchUserInfo.get("USER_ID");
		String str_FORCE_LOGIN = (String) searchUserInfo.get("FORCE_LOGIN");
		String str_SINGLE_LOGIN = (String) searchUserInfo.getOrDefault("SINGLE_LOGIN", "1");
		
		// 사용자 락이 걸려 있을 경우
		// 사용자 처리 이벤트는 우리쪽에서 처리 하지 않음
//		if (obj_LOCK_YSNO.equals("1")) {
//
//			// ID 또는 비밀번호가 올바르지 않습니다.
//			throw new CustomException("1002", null);
//		}
		
		if (str_SINGLE_LOGIN.equals("1")) {

			AuthenticationPrinciple<Map<String, Object>> authenticationPrinciple = AuthorizationHolder
					.getAuthorizationSessionStorage().load(str_USER_ID);
			
			
			// 빈값일 경우
			if (!Objects.isNull(authenticationPrinciple)) {
				
				Object str_WORK_IP = authenticationPrinciple.getSocket().getSession().getAttribute("WORK_IP");
				
				if (str_FORCE_LOGIN.equals("0")) {
					
					// 중복 로그인이 된 경우
					throw new CustomException("1004", (String)str_WORK_IP);
				} else {
					
					// 기존 로그인 로그아웃
					logoutOk(authenticationPrinciple.getUserInfo());
				}

			}
		}
		
		// 비밀번호 최종 변경 일자 (60일 기준)
		// 우리쪽에서 처리 하지 않음
	}
	*/
	
	
	/**
	 * 화면잠금해제
	 */
	@SuppressWarnings({ "unchecked" })
	public Object processUnlock(Map<String, Object> searchVo, HttpServletRequest request) {

		// 입력 파라미터 처리
		String sUserID = CryptSHA.base64Decode(searchVo.get("USER_ID").toString());

		searchVo.put("USER_ID", sUserID);

		Map<String, Object> searchUserInfo = (Map<String, Object>) comLoginDao.processLogin(searchVo);

		if ((searchUserInfo == null) || (searchUserInfo.isEmpty())) {

			// ID 또는 비밀번호가 올바르지 않습니다.
			throw new CustomException("-1", "TMM095");
		}

		// 사용자 아이디 비밀번호 검증
		String sUserPW   = CryptSHA.base64Decode(searchVo.get("PASS_WORD").toString());
		String sPassword = passwordEncoder.encode(sUserPW);

		if (searchUserInfo.get("PASS_WORD") == null || !searchUserInfo.get("PASS_WORD").equals(sPassword)) {

			// ID 또는 비밀번호가 올바르지 않습니다.
			throw new CustomException("-1", "TMM095");
		}

		// 패스워드 통과 후 사용자정보 및 로그인 기록 처리 searchUserInfo
		return searchUserInfo;
	}

	@SuppressWarnings({ "unchecked" })
	public Object  processGetMenu(Map<String, Object> searchVo, HttpServletRequest request) {

        Map<String, Object> returnMap = new HashMap<String, Object>();

        returnMap.put("gdsMenuList"  , comLoginDao.MENUDOWN(searchVo));
        returnMap.put("gdsMyMenuList"  , comLoginDao.MYMENUDOWN(searchVo));
        returnMap.put("dsMessage"      , comLoginDao.MESSAGEDOWN(searchVo));

        log.debug(" ...   ");
        log.debug("processGetMenu :   ", returnMap.toString());
        
        return returnMap;		
	}	
	
	/**
	 * <pre>
	 * 강제세션종료
	 * </pre>
	 */
	@Override
	public Object processLoginTerminate(Map<String, Object> searchVo, HttpServletRequest request) {

		return comLoginDao.processLoginTerminate(searchVo);
	}

	/**
	 * <pre>
	 * 패스워드변경
	 * </pre>
	 */
	@SuppressWarnings("unchecked")
	public Object processPasswordChange(Map<String, Object> searchVo) {

		// 현재 아이디와 비밀번호
		String sUserID = searchVo.get("USER_ID").toString();
		String sUserPW = searchVo.get("PASSWORD").toString();
		String sCahngePW = passwordEncoder.encode(searchVo.get("NEW_PASSWORD").toString());

		searchVo.put("USER_ID", sUserID);

		// 현재 비밀번호 확인하기.
		Map<String, Object> searchUserInfo = (Map<String, Object>) comLoginDao.processLogin(searchVo);

		if ((searchUserInfo == null) || (searchUserInfo.isEmpty())) {

			throw new CustomException("-1", "ID 또는 비밀번호가 올바르지 않습니다.");
		}

		// 사용자 아이디 비밀번호 검증
		sUserPW = passwordEncoder.encode(sUserPW);
		if (!searchUserInfo.get("PASS_WORD").equals(sUserPW)) {

			throw new CustomException("-1", "ID 또는 비밀번호가 올바르지 않습니다.");
		}

		// 현재 비밀번호가 맞다면 새로운 비밀번호 주고 변경하기
		searchVo.put("PASS_WORD", sCahngePW);
		
		return comLoginDao.processPasswordChange(searchVo);

	}

	/**
	 * <pre>
	 * 패스워드 초기화
	 * </pre>
	 */
    public Object processPWReset(Map<String, Object> searchVo) {

		// 현재 아이디
		String sUserID = searchVo.get("USER_ID").toString();
		String sCahngePW = passwordEncoder.encode("safe7900");
		searchVo.put("USER_ID", sUserID);
		searchVo.put("PASS_WORD", sCahngePW);
		
		return comLoginDao.processPasswordChange(searchVo);
    }
	
	
	/**
	 * <pre>
	 * 마이메뉴 추가/삭제
	 * </pre>
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Object processADDMYMENU(NexacroRequest saveData) {

		Map<String, Object> indata = new HashMap<String, Object>();

		Map rowVo = null;

		String sUserID = (String) SessionUtils.getAttribute("USER_ID");
		String sCOMP_ID = (String) SessionUtils.getAttribute("COMP_ID");

		List dsMyMenuList_Del = saveData.getDeletedDataset("dsMyMenuList");
		
		for (int i = 0; i < dsMyMenuList_Del.size(); i++) {
			rowVo = (Map) dsMyMenuList_Del.get(i);
			rowVo.put("USER_ID", sUserID);
			comLoginDao.processDELETEMYMENU(rowVo);
		}

		List dsMyMenuList = saveData.getSaveDataset("dsMyMenuList");

		for (int i = 0; i < dsMyMenuList.size(); i++) {

			rowVo = (Map) dsMyMenuList.get(i);
			rowVo.put("USER_ID", sUserID);
			comLoginDao.processINSERTMYMENU(rowVo);
		}
		
		String sMODULE = (String)saveData.getMapVariableList().getOrDefault("MOD", "");

		Map<String, Object> rtnData = new HashMap<String, Object>();

		indata.put( "USER_ID", sUserID  );
		indata.put( "COMP_ID", sCOMP_ID );
		indata.put( "MODULE" , sMODULE  );

		rtnData.put("dsMyMenuList", comLoginDao.processMYMENUDOWN(indata));

		return rtnData;

	}

	/**
	 * 접속 로그 기록
	 */
	public int processLOGCONN(Map<String, Object> saveData) {
		return comLoginDao.processLOGCONN(saveData);
	}

	/**
	 * 메뉴 로그 기록
	 */
	public int processLOGMENU(Map<String, Object> saveData) {
		return comLoginDao.processLOGMENU(saveData);
	}

	/**
	 * 로그아웃 기록
	 */
	@Override
	public int logoutOk(Map<String, Object> searchVo) {
		
		Object obj_USER_ID     = searchVo.get("USER_ID");
		Object obj_COMP_Id     = searchVo.get("COMP_ID");
		Object obj_CONN_TYPE   = "AA01A0020";
		Object obj_FAIL_YSNO   = "0";
		Object obj_FAIL_MSG    = "";
		Object obj_SESS_ID     = searchVo.get("SESS_ID");
		Object obj_CONN_IP     = searchVo.get("CONN_IP");
		Object obj_CONN_MAC    = searchVo.get("CONN_MAC");

		searchVo.put("USER_ID", obj_USER_ID); // 사용자ID
		searchVo.put("COMP_ID", obj_COMP_Id); // 회사ID
		searchVo.put("CONN_TYPE", obj_CONN_TYPE); // 로그구분:로그인
		searchVo.put("FAIL_YSNO", obj_FAIL_YSNO); // 로그인 실패여부
		searchVo.put("FAIL_MSG", obj_FAIL_MSG); // 로그인 실패메시지
		searchVo.put("SESS_ID", obj_SESS_ID); // 세션ID
		searchVo.put("WORK_IP", obj_CONN_IP); // 로그인 아이피
		searchVo.put("WORK_MAC", obj_CONN_MAC); // 로그인 맥 주소
		
		// 기존 로그인 정보 조회
		AuthenticationPrinciple<Map<String, Object>> authenticationPrinciple = AuthorizationHolder
				.getAuthenticationPrinciple((String) obj_USER_ID);

		try {
			// 로그인된 사용자 일 경우 메시지 처리
			if (!Objects.isNull(authenticationPrinciple)) {

				// 연결 정보를 불러와 연결 처리
				AuthenticationSfd2022Socket authenticationSfd2022Socket = authenticationPrinciple.getSocket();

				log.debug("===================================");
				log.debug("{}", searchVo.toString());
				log.debug("{}", authenticationSfd2022Socket);
				log.debug("===================================");
				
				AuthenticationJConnectionService.sendMessage(authenticationSfd2022Socket.getWebSocketSession(), "-1", "세션이 종료 되었습니다.");

				// 기존 로그인 제거
				AuthorizationHolder.getAuthorizationSessionStorage().unload((String) obj_USER_ID);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return comLoginDao.processLOGCONN(searchVo);
	}

	/**
	 * 로그인 기록
	 */
	@Override
	public int loginOk(Map<String, Object> searchVo) {

		Object obj_USER_ID = searchVo.get("USER_ID");
		Object obj_COMP_Id = searchVo.get("COMP_ID");
		Object obj_CONN_TYPE = "AA01A0010";
		Object obj_FAIL_YSNO = "0";
		Object obj_FAIL_MSG = "";
		Object obj_SESS_ID = searchVo.get("SESS_ID");
		Object obj_CONN_IP = searchVo.get("CONN_IP");
		Object obj_CONN_MAC = searchVo.get("CONN_MAC");

		searchVo.put("USER_ID", obj_USER_ID); // 사용자ID
		searchVo.put("COMP_ID", obj_COMP_Id); // 회사ID
		searchVo.put("CONN_TYPE", obj_CONN_TYPE); // 로그구분:로그인
		searchVo.put("FAIL_YSNO", obj_FAIL_YSNO); // 로그인 실패여부
		searchVo.put("FAIL_MSG", obj_FAIL_MSG); // 로그인 실패메시지
		searchVo.put("SESS_ID", obj_SESS_ID); // 세션ID
		searchVo.put("WORK_IP", obj_CONN_IP); // 로그인 아이피
		searchVo.put("WORK_MAC", obj_CONN_MAC); // 로그인 맥 주소
		
		return comLoginDao.processLOGCONN(searchVo);
	}

	/**
	 * 로그인 실패 기록
	 */
	public void loginFail(HttpServletRequest request, Map<String, Object> paramMap, String sFailMsg) {

		String str_CLIENT_IP = getClientIP(request);
		String str_MAC_ADDR = getClientMac(request);
		String str_IPTYPE = getInternalIp(str_CLIENT_IP);
		String str_VPN_CONN_IP = getRouterIP();

		HttpSession session = request.getSession(true);

		Map<String, Object> saveVo = new HashMap<String, Object>();

		// - 저장 컬럼 등록
		Object obj_USER_ID = paramMap.getOrDefault("USER_ID", "");
		Object obj_COMP_Id = paramMap.getOrDefault("COMP_ID", "");
		Object obj_CONN_TYPE = "AA01A0010";
		Object obj_FAIL_YSNO = "1";
		Object obj_FAIL_MSG = sFailMsg;
		Object obj_SESS_ID = session.getId();
		Object obj_CONN_IP = str_CLIENT_IP;
		Object obj_CONN_MAC = str_MAC_ADDR;
		Object obj_VPN_CONN_IP = str_VPN_CONN_IP;

		saveVo.put("USER_ID", obj_USER_ID); // 사용자ID
		saveVo.put("COMP_ID", obj_COMP_Id); // 회사ID
		saveVo.put("CONN_TYPE", obj_CONN_TYPE); // 로그구분:로그인
		saveVo.put("FAIL_YSNO", obj_FAIL_YSNO); // 로그인 실패여부
		saveVo.put("FAIL_MSG", obj_FAIL_MSG); // 로그인 실패메시지
		saveVo.put("SESS_ID", obj_SESS_ID); // 세션ID
		saveVo.put("CONN_IP", obj_CONN_IP); // 로그인 아이피
		saveVo.put("CONN_MAC", obj_CONN_MAC); // 로그인 맥 주소
		saveVo.put("VPN_CONN_IP", obj_VPN_CONN_IP); // 로그인 맥 주소

		comLoginDao.processLOGCONN(saveVo);

		// 사용자 아이디 또는 비밀번호가 올바르지 않습니다.
		throw new CustomException("1001", null);
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
	 * 내부 아이피 범위 지정
	 */
	public String getInternalIp(String ipxx) {

		long iSliceIp4 = getPureIp4(ipxx);

		String[] LInternalIpRR = internalIp.split(",");

		long iInternalFromIp4, iInternalToIp4;

		for (String ipRR : LInternalIpRR) {
			String[] str_internalIP4RR = ipRR.split("~");

			if (str_internalIP4RR.length > 0) {

				if (str_internalIP4RR.length == 1) {

					iInternalFromIp4 = getPureIp4(str_internalIP4RR[0]);
					iInternalToIp4 = getPureIp4(str_internalIP4RR[0]);
				} else {

					iInternalFromIp4 = getPureIp4(str_internalIP4RR[0]);
					iInternalToIp4 = getPureIp4(str_internalIP4RR[1]);
				}

				// 내부 아이피로 처리
				if (iSliceIp4 >= iInternalFromIp4 && iSliceIp4 <= iInternalToIp4) {

					return "INTERNAL";
				}
			}
		}

		// 외부 아이피로 처리
		return "EXTERNAL";
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
            //log.debug(ex.getMessage());
        }
        
        return null;
    }
	
	@Override
	public Object locale(Map<String, Object> searchVo) {
		
		return comLoginDao.processLocale(searchVo);
	}



	@Value("${sfd2022.iptables.internal:}")
	private String internalIp;


	@Override
	public Object processSapLogin(Map<String, Object> searchVo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object findByMessages(Map<String, Object> searchVo) {
		String codes = String.valueOf(searchVo.get("MSG_CD"));
		searchVo.put("MSG_CD", codes.split(","));
		return comLoginDao.findByMessages(searchVo);
	}
}
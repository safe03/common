package com.safecnc.comm.scrt;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * 권한 인증과 관련 된 사용자 정보를 조회하는 서비스 객체<br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see UserDetails
 * @see UserDetailsService
 * @see ReloadableResourceBundleMessageSource
 * 
 */
public class NexacroUserDetailService implements UserDetailsService{

	@Autowired
	private ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		UserDetails userDetails = null;
		
		// 리소스를 처리
		try(SqlSession session = sqlsessionFactory.openSession()){
			
			Map<String,Object> parameters = new HashMap<String, Object>();
			
			parameters.put("USER_ID"  , username);
			
			Map<String,Object> userInfo = session.selectOne("COMLOGIN.LOGINCHECK", parameters);
			
			if(Objects.isNull(userInfo))
			{
				//- "사용자 또는 비밀번호를 확인하세요."
				throw new UsernameNotFoundException(reloadableResourceBundleMessageSource.getMessage("1101", null, Locale.ENGLISH));
			}
			
			userDetails = new NexacroUserDetails(userInfo);
		}
		
		return userDetails;
	}
	
	/**
	 * 사용자의 상제 정보를 조회하는 함수 
	 * @param nexacroUserDetails 사용자 정보를 가지고 있는 디테일 객체
	 * @return 
	 */
	public UserDetails getMapUserDetails(NexacroUserDetails nexacroUserDetails)
	{
		
		Map<String,Object> userInfo = nexacroUserDetails.getUserInfo();
		
		// 사용자 정보를 추출
		Map<String,Object> mapUserDetail = new HashMap<String, Object>();

		// 데이터를 가져온 다음 세션과 사용자 디테일에 등록
		Object obj_USER_ID   = userInfo.get("USER_ID");
		Object obj_USER_NM   = userInfo.get("USER_NM");
		//Object obj_USER_TYPE = userInfo.get("USER_TYPE");
		Object obj_COMP_ID   = userInfo.get("COMP_ID");
		Object obj_COMP_NM   = userInfo.get("COMP_NM");
		Object obj_DEPT_CD   = userInfo.get("DEPT_CD");
		Object obj_DEPT_NM   = userInfo.get("DEPT_NM");
		Object obj_OPEN_TAB  = userInfo.get("OPEN_TAB");
        Object obj_LANG_CODE = userInfo.get("LANG_CODE");
        Object obj_USR_GB    = userInfo.get("USR_GU");
        Object obj_USER_FILE = userInfo.get("FILE");
        Object obj_LOGO      = userInfo.get("LOGO");
        Object obj_NICKNAME  = userInfo.get("NICKNAME");
        Object obj_EMAIL1	 = userInfo.get("EMAIL1");
        Object obj_AUTH_GR   = userInfo.get("AUTH_GR_CD");
        
        /*
        Object obj_PERNR     = userInfo.get("PERNR");
        Object obj_SAP_GB    = userInfo.get("SAP_GB");
        Object obj_SAP_INST  = userInfo.get("SAP_INST");
        */
		// 리소스를 처리
		try(SqlSession session = sqlsessionFactory.openSession()){

			// 시스템 전역 변수를 애플리케이션 영역으로 할당
			mapUserDetail.put("GBL_USERID"      , obj_USER_ID);
			mapUserDetail.put("GBL_USERNM"      , obj_USER_NM);
			mapUserDetail.put("GBL_COMPID"      , obj_COMP_ID);
			mapUserDetail.put("GBL_COMPNM"      , obj_COMP_NM);
			mapUserDetail.put("GBL_DEPTCD"      , obj_DEPT_CD);
			mapUserDetail.put("GBL_DEPTNM"      , obj_DEPT_NM);
			mapUserDetail.put("GBL_WINMAXNUM"   , obj_OPEN_TAB);
			mapUserDetail.put("GBL_LANGCD"      , obj_LANG_CODE);
			mapUserDetail.put("GBL_USR_GB"      , obj_USR_GB);
			mapUserDetail.put("GBL_USER_FILE"   , obj_USER_FILE);
			mapUserDetail.put("GBL_LOGO"        , obj_LOGO);
			mapUserDetail.put("GBL_NICKNAME"    , obj_NICKNAME);
			mapUserDetail.put("GBL_EMAIL1"    	, obj_EMAIL1);
			mapUserDetail.put("GBL_AUTH_GR"    	, obj_AUTH_GR);
			
			
			//mapUserDetail.put("GBL_USERTYPE"    , obj_USER_TYPE);
			/*
			mapUserDetail.put("GBL_LOGINIP"     , "");
			mapUserDetail.put("GBL_DBTYPECD"    , "");
			mapUserDetail.put("GBL_SERVERGUBUN" , "");
			mapUserDetail.put("GBL_LGINDT"      , "");
			mapUserDetail.put("GBL_SAP_GB"      , obj_SAP_GB);
			mapUserDetail.put("GBL_SAP_ID"      , obj_PERNR);
			mapUserDetail.put("GBL_SAP_PW"      , "");
			mapUserDetail.put("GBL_SAP_INST"    , obj_SAP_INST);
			mapUserDetail.put("GBL_SAP_HOST"    , sapAhost);
			*/
			// 기본 메뉴목록 조회
			//mapUserDetail.put("gdsMenuList"   , session.selectList("COMLOGIN.MENUDOWN", userInfo));
			
			// 마이메뉴 목록 조회
			//mapUserDetail.put("gdsMyMenuList" , session.selectList("COMLOGIN.MYMENUDOWN", userInfo));
			
			// 시스템 공통메시지 목록 조회
			mapUserDetail.put("dsMessage"     , session.selectList("COMLOGIN.MESSAGEDOWN", userInfo));  

			// 다국어 조회
			mapUserDetail.put("gdsLangCode"   , session.selectList("COMLOGIN.LANGXM", userInfo)); 
			
			// 다국어워드 조회
			mapUserDetail.put("gdsLangWord"   , session.selectList("COMLOGIN.LANGWORD", userInfo));
			
			// 다국어워드 조회
			mapUserDetail.put("gdsLangAuto"   , session.selectList("COMLOGIN.LANGAUTO", userInfo));

			// 리포트권한리스트 조회
			mapUserDetail.put("gdsReportList"   , session.selectList("COMLOGIN.AUTH_REPORT", userInfo));
			 
			// 로그인가능회사 조회
			//userDetail.put("dsLoginCOMP"  , comLoginDao.processGETLOGINCOMP(searchUserInfo)); 
			
			nexacroUserDetails.setMapUserDetails(mapUserDetail);
		}
		
		return nexacroUserDetails;
	}
	
	/**
	 * 사용자의 로그인 로그를 남기는 함수
	 * @param nexacroUserDetails 사용자 정보를 가지고 있는 디테일 객체
	 * @return 
	 */
	public void login(Map<String,Object> userInfo)
	{
		Object obj_USER_IDXX = userInfo.get("USER_ID");
		Object obj_COMP_IDXX = userInfo.get("COMP_ID");
		Object obj_CONN_TYPE = "AA01A0010";
		Object obj_FAIL_YSNO = userInfo.get("FAIL_YSNO");
		Object obj_FAIL_MSGX = userInfo.get("FAIL_MSGX");
		Object obj_WORK_SESS = userInfo.get("WORK_SESS");
		Object obj_WORK_IPXX = userInfo.get("WORK_IPXX");
		Object obj_WORK_MACX = userInfo.get("WORK_MACX");
		Object obj_SERV_TYPE = "";
		
		// 리소스를 처리
		try(SqlSession session = sqlsessionFactory.openSession()){
		
			Map<String,Object> parameters = new HashMap<String, Object>();
			
			parameters.put("USER_IDXX"  , obj_USER_IDXX);
			parameters.put("COMP_IDXX"  , obj_COMP_IDXX);
			parameters.put("CONN_TYPE"  , obj_CONN_TYPE);
			parameters.put("FAIL_YSNO"  , obj_FAIL_YSNO);
			parameters.put("FAIL_MSGX"  , obj_FAIL_MSGX);
			parameters.put("WORK_SESS"  , obj_WORK_SESS);
			parameters.put("WORK_IPXX"  , obj_WORK_IPXX);
			parameters.put("WORK_MACX"  , obj_WORK_MACX);
			parameters.put("SERV_TYPE"  , obj_SERV_TYPE);
			
			session.update("COMLOGIN.LOGCONN", parameters);
		}
	}
	
	/**
	 * 사용자의 로그아웃 로그를 남기는 함수 
	 * @param nexacroUserDetails 사용자 정보를 가지고 있는 디테일 객체
	 * @return 
	 */
	public void logout(Map<String,Object> userInfo)
	{
		Object obj_USER_IDXX = userInfo.get("USER_ID");
		Object obj_COMP_IDXX = userInfo.get("COMP_ID");
		Object obj_CONN_TYPE = "AA01A0020";
		Object obj_FAIL_YSNO = "0";
		Object obj_FAIL_MSGX = "";
		Object obj_WORK_SESS = userInfo.get("WORK_SESS");
		Object obj_WORK_IPXX = userInfo.get("WORK_IPXX");
		Object obj_WORK_MACX = userInfo.get("WORK_MACX");
		Object obj_SERV_TYPE = "";
		
		// 리소스를 처리
		try(SqlSession session = sqlsessionFactory.openSession()){
		
			Map<String,Object> parameters = new HashMap<String, Object>();
			
			parameters.put("USER_IDXX"  , obj_USER_IDXX);
			parameters.put("COMP_IDXX"  , obj_COMP_IDXX);
			parameters.put("CONN_TYPE"  , obj_CONN_TYPE);
			parameters.put("FAIL_YSNO"  , obj_FAIL_YSNO);
			parameters.put("FAIL_MSGX"  , obj_FAIL_MSGX);
			parameters.put("WORK_SESS"  , obj_WORK_SESS);
			parameters.put("WORK_IPXX"  , obj_WORK_IPXX);
			parameters.put("WORK_MACX"  , obj_WORK_MACX);
			parameters.put("SERV_TYPE"  , obj_SERV_TYPE);
			
			session.update("COMLOGIN.LOGCONN", parameters);
		}
	}
	
	public SqlSessionFactory getSqlsessionFactory() {
		return sqlsessionFactory;
	}
	
	public void setSqlsessionFactory(SqlSessionFactory sqlsessionFactory) {
		this.sqlsessionFactory = sqlsessionFactory;
	}

	private SqlSessionFactory sqlsessionFactory;
	
	// SAP를 사용하지 않으므로 제거
	//@Value("${sfd2022.sap.client.ashost}")
	private String sapAhost;
	
}

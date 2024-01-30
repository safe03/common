package com.safecnc.comm.srvc;

import com.safecnc.request.NexacroRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/*******************************************************************
<h1>NAME : </h1>
<p>로그인 처리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
</pre>
********************************************************************/

public interface ComLoginService {

    //로그인
    //public Object processLogin(Map<String, Object> searchVo, HttpServletRequest request);
    
    //SAP 로그인
    public Object processSapLogin(Map<String, Object> searchVo);
    
    //언락
    public Object processUnlock(Map<String, Object> searchVo, HttpServletRequest request);
    
    //강제세션종료
    public Object processLoginTerminate(Map<String, Object> searchVo, HttpServletRequest request);

    //패스워드 변경
    public Object processPasswordChange(Map<String, Object> searchVo);

    //패스워드 초기화
    public Object processPWReset(Map<String, Object> searchVo);
    
    //마이메뉴 추가
    public Object processADDMYMENU(NexacroRequest saveData) ;
    
    //메뉴 로그 기록
    public int processLOGMENU(Map<String, Object> saveData) ;
    
    //로그인 정보 검증
    //public void loginCheck(Map<String, Object> searchVo) ;
    
    //로그인 정보 저장
    public int loginOk(Map<String, Object> searchVo) ;

    //로그아웃 정보 저장
    public int logoutOk(Map<String, Object> searchVo) ;
    
    //인증 실패 메시지
    public void loginFail(HttpServletRequest request, Map<String, Object> searchVo, String sFailMsg) ;

    //언어셋 조회
    public Object locale(Map<String, Object> searchVo) ;

    // 메뉴조회
	public Object  processGetMenu(Map<String, Object> searchVo, HttpServletRequest request) ;

    // 찾을 메세지 코드
	public Object  findByMessages(Map<String, Object> searchVo) ;
}
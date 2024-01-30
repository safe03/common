package com.safecnc.comm.srvc.impl;

import com.safecnc.comm.rtlm.AbstractMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/*******************************************************************
<h1>NAME : </h1>
<p>로그인 DAO</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
</pre>
********************************************************************/

@Slf4j
@Repository("ComLoginDao")
public class ComLoginDao extends AbstractMapper{

    /**
     * <pre>
     * 로그인 정보 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLogin(Map searchVo)  {
    	
        return session.selectOne("COMLOGIN.LOGINCHECK", searchVo);
    }
    
    /**
     * <pre>
     * 로그인 정보 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processSapLogin(Map searchVo)  {
    	
    	return call("YZTOOL7_GET_EMPNO_SAPID", searchVo).getResult();
    }
    
    /**
     * <pre>
     * 강제세션종료
     * </pre>
     *
     * @param saveData
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLoginTerminate(Map saveData) {
    	
        return session.insert("COMLOGIN.LOGINTERMINATE", saveData);
    }

    /**
     * <pre>
     * 비밀번호 변경
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public int processPasswordChange(Map searchVo)  {
    	
        return session.update("COMLOGIN.PASSWORDCHANGE", searchVo);
    }
    
    /**
     * <pre>
     * 로그인가능 충전소 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processGETLOGINCOMP(Map searchVo)  {
        return session.selectList("COMLOGIN.GETLOGINCOMP", searchVo);
    }
    
    /**
     * <pre>
     * 충전소 정보 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processGETCOMPINFO(Map searchVo)  {
        return session.selectOne("COMLOGIN.GETCOMPINFO", searchVo);
    }

    /**
     * <pre>
     * 메뉴리스트 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processMENUDOWN(Map searchVo)  {
    	log.debug("searchVo : {}", searchVo);
        return session.selectList("COMLOGIN.MENUDOWN", searchVo);
    }

    /**
     * <pre>
     * 메뉴리스트 조회  :  MENU LIST 추가 
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public List<Map<String,Object>> MENUDOWN(Map<String,Object> searchVo) {
    	log.debug("searchVo : {}", searchVo);
        return session.selectList("COMLOGIN.MENUDOWN", searchVo);
    }
    
    /**
     * <pre>
     * 마이메뉴리스트 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processMYMENUDOWN(Map searchVo)  {
        return session.selectList("COMLOGIN.MYMENUDOWN", searchVo);
    }
    
    /**
     * <pre>
     * 마이메뉴리스트 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public List<Map<String,Object>> MYMENUDOWN(Map searchVo)  {
        return session.selectList("COMLOGIN.MYMENUDOWN", searchVo);
    }

    /**
     * <pre>
     * 마이메뉴 저장
     * </pre>
     *
     * @param dataVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processINSERTMYMENU(Map dataVo)  {
        return session.insert("COMLOGIN.INSERTMYMENU", dataVo);
    }

    /**
     * <pre>
     * 마이메뉴삭제
     * </pre>
     *
     * @param dataVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public int processDELETEMYMENU(Map dataVo)  {
        return session.delete("COMLOGIN.DELETEMYMENU", dataVo);
    }

    /**
     * <pre>
     * 메세지리스트 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processMESSAGEDOWN(Map searchVo)  {
        return session.selectList("COMLOGIN.MESSAGEDOWN", searchVo);
    }

    /**
     * <pre>
     * 메세지리스트 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public List<Map<String,Object>> MESSAGEDOWN(Map searchVo)  {
        return session.selectList("COMLOGIN.MESSAGEDOWN", searchVo);
    }
    /**
     * <pre>
     * 접속로그 저장
     * </pre>
     *
     * @param saveData
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public int processLOGCONN(Map saveData) {
        return session.insert("COMLOGIN.LOGCONN", saveData);
    }

    /**
     * <pre>
     * 메뉴접근 저장
     * </pre>
     *
     * @param saveData
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public int processLOGMENU(Map saveData) {
        return session.insert("COMLOGIN.LOGMENU", saveData);
    }
    
    /**
     * <pre>
     * 다국어 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLANGXM(Map searchVo)  {
        return session.selectList("COMLOGIN.LANGXM", searchVo);
    }
    
    /**
     * <pre>
     * 다국어워드 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLANGWORD(Map searchVo)  {
        return session.selectList("COMLOGIN.LANGWORD", searchVo);
    }
    
    /**
     * <pre>
     * 다국어워드 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLANGAUTO(Map searchVo)  {
        return session.selectList("COMLOGIN.LANGAUTO", searchVo);
    }
    
    /**
     * <pre>
     * 다국어 언어 셋 조회
     * </pre>
     *
     * @param searchVo
     * @return
     * @
     */
    @SuppressWarnings("rawtypes")
    public Object processLocale(Map searchVo)  {
    	
    	return session.selectList("COMLOGIN.LOCALE", searchVo);
    }

    /**
     * 가져올 메시지를 찾아서 반환
     * @param searchVo
     * @return
     */
    public Object findByMessages(Map searchVo) {
        return session.selectList("COMLOGIN.FIND_MESSAGE", searchVo);
    }

}

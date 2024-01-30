package com.safecnc.comm.srvc.impl;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;

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
@Repository("CommonServiceDao")
public class CommonServiceDao extends AbstractMapper{

	
	/**
	 * <pre>
	 * 사용자 패치 step1
	 * </pre>
	 *
	 * @param searchVo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public Object P_LOGN01_IFID_002_STEP1()  {
		return session.delete("COMLOGIN.SP_IF_TA_USER_M_DEL00");
	}
	
	/**
	 * <pre>
	 * 사용자 패치 step2
	 * </pre>
	 *
	 * @param searchVo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public int P_LOGN01_IFID_002_STEP2(Map saveRow)  {
		return session.insert("COMLOGIN.SP_IF_TA_USER_M_INS00", saveRow);
	}
    /**
     * <pre>
     * 사용자 패치 step3
     * </pre>
     *
     * @param searchVo
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Object P_LOGN01_IFID_002_STEP3()  {
    	
        return session.selectOne("TEST.P_LOGN01_IFID_002_STEP3");
    }
    
    /**
     * <pre>
     * 공통 코드 패치 (마스터)
     * </pre>
     *
     * @param searchVo
     * @return
     */
    @SuppressWarnings("rawtypes")
    public int SP_IF_TA_CODE_M(Map saveRow)  {
    	
    	return session.insert("COMLOGIN.SP_IF_TA_CODE_M", saveRow);
    }
    
    /**
     * <pre>
     * 공통 코드 패치 (마스터)
     * </pre>
     *
     * @param searchVo
     * @return
     */
    @SuppressWarnings("rawtypes")
    public int SP_IF_TA_CODE_D(Map saveRow)  {
    	
    	return session.insert("COMLOGIN.SP_IF_TA_CODE_D", saveRow);
    }
    
}

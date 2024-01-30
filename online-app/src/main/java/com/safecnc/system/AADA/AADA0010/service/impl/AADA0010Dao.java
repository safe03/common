package com.safecnc.system.AADA.AADA0010.service.impl;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

/*******************************************************************
<h1>NAME : </h1>
<p>회사그룹권한관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-06-18  이진혁           최초생성
</pre>
********************************************************************/

@Repository("AADA0010Dao")
public class AADA0010Dao extends AbstractMapper{
	
	/**
	 * 권한 그룹 조회하는 함수
	 * @param searchVo 파라미터 리스트
	 * @return Plant list
	 */
	public Object SEL00(Map<String, Object> searchVo) {
		return session.selectList("AADA0010.SEL00", searchVo);
	}
	
	/**
	 * 부여 권한 리스트 조회하는 함수
	 * @param searchVo 파라미터 리스트
	 * @return User list
	 */
	public Object SEL10(Map<String, Object> searchVo) {
		return session.selectList("AADA0010.SEL10", searchVo);
	}
	
	
	/**
	 * 그룹 권한 리스트 등록하는 함수
	 * @param nexacroRequest 넥사크로 요청 객체
	 * @return 저장 결과값
	 */
	public int INS00(Map<String, Object> searchVo) {
		return session.update("AADA0010.INS00", searchVo);
	}
	
	
	/**
	 * 그룹 권한 리스트 수정하는 함수
	 * @param nexacroRequest 넥사크로 요청 객체
	 * @return 저장 결과값
	 */
	public int UPD00(Map<String, Object> searchVo) {
		return session.update("AADA0010.UPD00", searchVo);
	}
	
	
	/**
	 * 그룹 권한 리스트 삭제하는 함수
	 * @param nexacroRequest 넥사크로 요청 객체
	 * @return 저장 결과값
	 */
	public int DEL00(Map<String, Object> searchVo) {
		return session.update("AADA0010.DEL00", searchVo);
	}
	
	/**
	 * 부여 권한 리스트 저장(등록/수정)하는 함수
	 * @param nexacroRequest 넥사크로 요청 객체
	 * @return 저장 결과값
	 */
	public int SAV10(Map<String, Object> searchVo) {
		return session.update("AADA0010.SAV10", searchVo);
	}
}

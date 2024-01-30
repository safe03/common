package com.safecnc.system.AADA.AADA0010.service;

import java.util.Map;

import com.safecnc.request.NexacroRequest;

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

public interface AADA0010Service {
	
	/**
	 * 권한 그룹 조회하는 함수
	 * @param searchVo 파라미터 리스트
	 * @return Plant list
	 */
	Object SEL00(Map<String,Object> searchVo); 
	
	/**
	 * 부여 권한 리스트 조회하는 함수
	 * @param searchVo 파라미터 리스트
	 * @return User list
	 */
	Object SEL10(Map<String, Object> searchVo);
	
	/**
	 * 1. 권한 그룹을 저장(등록/수정/삭제)하는 함수
	 * 2. 부여 권한 리스트 저장(등록/수정)하는 함수
	 * @param nexacroRequest 넥사크로 요청 객체
	 * @return 저장 결과값
	 */
	Object SAV00(NexacroRequest nexacroRequest);
	
}

package com.safecnc.system.AAAA.AAAA0010.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 공통코드관리</h1>
<p>공통코드관리</p>
<h2>DESC : 공통코드관리</h2>
<p>공통코드관리 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AAAA0010Dao")
public class AAAA0010Dao extends AbstractMapper {

	/**
	 * 공통코드 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0010.SEL00", searchRow);
	}

	/**
	 * 공통코드 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {

		return session.insert("AAAA0010.INS00", saveRow);
	}

	/**
	 * 공통코드 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AAAA0010.UPD00", saveRow);
	}

	/**
	 * 공통코드 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {

		return session.delete("AAAA0010.DEL00", saveRow);
	}
	
	
	/**
	 * 세부코드 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0010.SEL10", searchRow);
	}

	/**
	 * 세부코드 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS10(Map<String,Object> saveRow) {

		return session.insert("AAAA0010.INS10", saveRow);
	}

	/**
	 * 세부코드 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD10(Map<String,Object> saveRow) {
		
		return session.update("AAAA0010.UPD10", saveRow);
	}

	/**
	 * 세부코드 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL10(Map<String,Object> saveRow) {

		return session.delete("AAAA0010.DEL10", saveRow);
	}
}

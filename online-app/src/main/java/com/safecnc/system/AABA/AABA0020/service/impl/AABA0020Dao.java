package com.safecnc.system.AABA.AABA0020.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 메뉴구조관리</h1>
<p>메뉴구조관리</p>
<h2>DESC : 메뉴구조관리</h2>
<p>메뉴구조관리 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AABA0020Dao")
public class AABA0020Dao extends AbstractMapper {

	/**
	 * 메뉴구조 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AABA0020.SEL00", searchRow);
	}
	
	
	/**
	 * 메뉴구조 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow) {
		
		return session.selectList("AABA0020.SEL10", searchRow);
	}
	

	/**
	 * 메뉴구조 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AABA0020.INS00", saveRow);
	}

	/**
	 * 메뉴구조 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AABA0020.UPD00", saveRow);
	}

	/**
	 * 메뉴구조 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("AABA0020.DEL00", saveRow);
	}
}

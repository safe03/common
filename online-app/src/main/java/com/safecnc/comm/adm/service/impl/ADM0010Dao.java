package com.safecnc.comm.adm.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : UserManagement</h1>
<p>UserManagement</p>
<h2>DESC : UserManagement</h2>
<p>UserManagement 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-11  jks            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("ADM0010Dao")
public class ADM0010Dao extends AbstractMapper {
	/**
	 * UserManagement 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0010.SEL00", searchRow);
	}

	/**
	 * 동인 사용자조회 팝업
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH01(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0010.SEL01", searchRow);
	}
	
	/**
	 * BUYER조회 팝업
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH02(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0010.SEL02", searchRow);
	}
	
	/**
	 * SUPPLIER조회 팝업
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH03(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0010.SEL03", searchRow);
	}
	

	/**
	 * BUYER/SUPPLIER combo 조회 
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH04(Map<String,Object> searchRow, String GUBN) {
		searchRow.put("iGUBN", GUBN);
		return session.selectList("ADM0010.SEL04", searchRow);
	}
	
	
	/**
	 * UserManagement 저장하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {

		return session.insert("ADM0010.INS00", saveRow);
	}

	/**
	 * UserManagement 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("ADM0010.UPD00", saveRow);
	}
	
	/**
	 * Season UserManagement 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("ADM0010.DEL00", saveRow);
	}	
}

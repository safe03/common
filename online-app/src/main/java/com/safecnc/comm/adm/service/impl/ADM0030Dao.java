package com.safecnc.comm.adm.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : Season Management</h1>
<p>Season Management</p>
<h2>DESC : Season Management</h2>
<p>Season Management 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-30  jks            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("ADM0030Dao")
public class ADM0030Dao extends AbstractMapper {
	/**
	 * Season Management 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0030.SEL00", searchRow);
	}

	/**
	 * BUYER/SEASON 콤보
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH01(Map<String,Object> searchRow, String Gubn) {
		searchRow.put("iGUBN", Gubn);
		return session.selectList("ADM0030.SEL01", searchRow);
	}
	
	/**
	 * SUPPLIER조회 팝업
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH03(Map<String,Object> searchRow) {
		
		return session.selectList("ADM0030.SEL03", searchRow);
	}
	
	/**
	 * Season Management 저장하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {

		return session.insert("ADM0030.INS00", saveRow);
	}

	/**
	 * Season Management 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("ADM0030.UPD00", saveRow);
	}
	
	/**
	 * Season Management 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("ADM0030.DEL00", saveRow);
	}	
}
